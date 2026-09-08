// ============================================
// ELEMENTS
// ============================================

const requestForm =
    document.getElementById("requestForm");

const requestSearch =
    document.getElementById("requestSearch");

const requesterFilter =
    document.getElementById("requesterFilter");

const requestList =
    document.getElementById("requestList");

const serviceRequestsSection =
    document.getElementById("serviceRequestsSection");

const createRequestSection =
    document.getElementById("createRequestSection");

const requestMessage =
    document.getElementById("requestMessage");

const submitRequestBtn =
    document.getElementById("submitRequestBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const backToCreateBtn =
    document.getElementById("backToCreateBtn");

let allRequests = [];
let editingRequestId = null;


// ============================================
// CHECK LOGIN
// ============================================

async function checkUser() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        window.location.href = "login.html";

        return null;
    }

    return user;
}


// ============================================
// LOAD REQUESTS
// ============================================

async function loadRequests() {

    const user = await checkUser();

    if (!user) {
        return;
    }

    requestList.innerHTML =
        "<p>Loading requests...</p>";


    const {
        data,
        error
    } = await supabaseClient

        .from("service_requests")

        .select("*")

        .order("created_at", {
            ascending: false
        });


    if (error) {

        requestList.innerHTML =
            `<p class="error">
                Error loading requests:
                ${error.message}
            </p>`;

        return;
    }


    if (!data || data.length === 0) {

        requestList.innerHTML =
            "<p>No service requests yet.</p>";

        return;
    }

    populateRequesterFilter(data);

    requestList.innerHTML = "";


    data.forEach(request => {

        const requestCard =
            document.createElement("div");

        requestCard.className =
            "request-card";

        requestCard.dataset.requester =
            (request.requester_name || "").toLowerCase();


        requestCard.innerHTML = `

            <div class="request-header">

                <h3>
                    Request #${request.id}
                </h3>

                <span class="status">
                    ${request.status}
                </span>

            </div>


            <p>
                <strong>Requester:</strong>
                ${escapeHTML(request.requester_name)}
            </p>


            <p>
                <strong>Department:</strong>
                ${escapeHTML(request.department)}
            </p>


            <p>
                <strong>Category:</strong>
                ${escapeHTML(request.category)}
            </p>


            <p>
                <strong>Priority:</strong>
                ${escapeHTML(request.priority)}
            </p>


            <p>
                <strong>Description:</strong>
                ${escapeHTML(request.description)}
            </p>


            <p class="date">
                ${new Date(request.created_at)
                    .toLocaleString()}
            </p>


            <div class="request-actions">

                <button
                    class="btn-edit"
                    onclick="editRequest(${request.id})"
                >
                    Edit
                </button>


                <button
                    class="btn-danger"
                    onclick="deleteRequest(${request.id})"
                >
                    Delete
                </button>

            </div>

        `;


        requestList.appendChild(requestCard);

    });

}


function populateRequesterFilter(data) {

    if (!requesterFilter) {
        return;
    }

    const names = [...new Set(
        data
            .map(request => request.requester_name)
            .filter(Boolean)
    )].sort((firstName, secondName) =>
        firstName.localeCompare(secondName)
    );

    requesterFilter.innerHTML =
        '<option value="">All requesters</option>';

    names.forEach(name => {
        const option = document.createElement("option");
        option.value = name.toLowerCase();
        option.textContent = name;
        requesterFilter.appendChild(option);
    });
}


function filterDisplayedRequests() {

    if (serviceRequestsSection) {
        serviceRequestsSection.classList.remove("hidden");
    }

    const searchTerm =
        (requestSearch.value || "").trim().toLowerCase();

    const selectedName =
        requesterFilter.value;

    document.querySelectorAll(".request-card").forEach(card => {
        const requesterName = card.dataset.requester || "";
        const matchesSearch = requesterName.includes(searchTerm);
        const matchesFilter = !selectedName || requesterName === selectedName;

        card.hidden = !(matchesSearch && matchesFilter);
    });
}


// ============================================
// SUBMIT REQUEST
// ============================================

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const user = await checkUser();

            if (!user) {
                return;
            }


            const requesterName =
                document
                    .getElementById("requesterName")
                    .value
                    .trim();


            const department =
                document
                    .getElementById("department")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("category")
                    .value;


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const priority =
                document
                    .getElementById("priority")
                    .value;


            requestMessage.textContent =
                "Submitting request...";


            const requestData = {
                requester_name: requesterName,
                department: department,
                category: category,
                description: description,
                priority: priority
            };

            let error;

            if (editingRequestId) {
                ({ error } = await supabaseClient
                    .from("service_requests")
                    .update(requestData)
                    .eq("id", editingRequestId)
                    .eq("user_id", user.id));
            } else {
                ({ error } = await supabaseClient
                    .from("service_requests")
                    .insert([{ ...requestData, user_id: user.id }]));
            }


            if (error) {

                requestMessage.textContent =
                    "Error: " + error.message;

                return;
            }


            requestMessage.textContent = editingRequestId
                ? "Service request updated successfully!"
                : "Service request submitted successfully!";


            requestForm.reset();
            editingRequestId = null;

            if (submitRequestBtn) {
                submitRequestBtn.textContent = "Submit Request";
            }

            if (serviceRequestsSection) {
                serviceRequestsSection.classList.remove("hidden");
            }


            await loadRequests();

        }
    );

}


// ============================================
// DELETE REQUEST
// ============================================

async function deleteRequest(id) {

    const user = await checkUser();

    if (!user) {
        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this request?"
        );


    if (!confirmDelete) {
        return;
    }


    const {
        error
    } = await supabaseClient

        .from("service_requests")

        .delete()

        .eq("id", id)

        .eq("user_id", user.id);


    if (error) {

        alert(
            "Delete failed: " +
            error.message
        );

        return;
    }


    alert(
        "Request deleted successfully."
    );


    loadRequests();

}


// ============================================
// EDIT REQUEST
// ============================================

async function editRequest(id) {

    const user = await checkUser();

    if (!user) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient

        .from("service_requests")

        .select("*")

        .eq("id", id)

        .eq("user_id", user.id)

        .single();


    if (error) {

        alert(
            "Unable to get request: " +
            error.message
        );

        return;
    }


    document.getElementById("requesterName").value =
        data.requester_name || "";
    document.getElementById("department").value =
        data.department || "";
    document.getElementById("category").value =
        data.category || "";
    document.getElementById("description").value =
        data.description || "";
    document.getElementById("priority").value =
        data.priority || "";

    editingRequestId = id;

    if (submitRequestBtn) {
        submitRequestBtn.textContent = "Update Request";
    }

    requestMessage.textContent =
        "Editing request #" + id + ". Update the fields and submit.";

    createRequestSection.classList.remove("hidden");
    createRequestSection.scrollIntoView({ behavior: "smooth" });

}


// ============================================
// LOGOUT
// ============================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await supabaseClient
                .auth
                .signOut();


            if (error) {

                alert(
                    "Logout failed: " +
                    error.message
                );

                return;
            }


            window.location.href =
                "login.html";

        }
    );

}


// ============================================
// REFRESH
// ============================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadRequests
    );

}


if (requestSearch) {
    requestSearch.addEventListener(
        "focus",
        () => serviceRequestsSection.classList.remove("hidden")
    );

    requestSearch.addEventListener(
        "input",
        filterDisplayedRequests
    );
}


if (requesterFilter) {
    requesterFilter.addEventListener(
        "click",
        () => serviceRequestsSection.classList.remove("hidden")
    );

    requesterFilter.addEventListener(
        "change",
        filterDisplayedRequests
    );
}


// BACK TO REQUEST FORM
// ============================================

if (backToCreateBtn) {

    backToCreateBtn.addEventListener(
        "click",
        () => {

            serviceRequestsSection.classList.add("hidden");
            createRequestSection.classList.remove("hidden");

        }
    );

}


// ============================================
// ESCAPE HTML
// Prevents HTML injection in displayed data
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// ============================================
// INITIAL LOAD
// ============================================

loadRequests();