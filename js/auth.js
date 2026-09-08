const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const registerBtn = document.getElementById("registerBtn");


// ============================================
// LOGIN
// ============================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loginMessage.textContent = "Logging in...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {

            loginMessage.textContent =
                "Login failed: " + error.message;

            return;
        }

        loginMessage.textContent = "Login successful!";

        window.location.href = "index.html";
    });
}


// ============================================
// REGISTER
// ============================================

if (registerBtn) {

    registerBtn.addEventListener("click", (event) => {

        event.preventDefault();

        // Show the registration modal
        const registerModal = document.getElementById("registerModal");
        if (registerModal) {
            registerModal.style.display = "flex";
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const registerEmail = document.getElementById("registerEmail").value.trim();
        const registerPassword = document.getElementById("registerPassword").value;
        const registerConfirmPassword = document.getElementById("registerConfirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        // Validation
        if (!registerEmail || !registerPassword) {
            registerMessage.textContent = "Please fill in all fields";
            registerMessage.style.color = "red";
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            registerMessage.textContent = "Passwords do not match";
            registerMessage.style.color = "red";
            return;
        }

        if (registerPassword.length < 6) {
            registerMessage.textContent = "Password must be at least 6 characters";
            registerMessage.style.color = "red";
            return;
        }

        registerMessage.textContent = "Creating account...";
        registerMessage.style.color = "#666";

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: registerEmail,
                password: registerPassword
            });

        if (error) {
            registerMessage.textContent = "Registration failed: " + error.message;
            registerMessage.style.color = "red";
            return;
        }

        registerMessage.textContent = "Account created successfully! Check your email to confirm.";
        registerMessage.style.color = "green";

        // Clear form
        setTimeout(() => {
            registerForm.reset();
            closeRegisterModal();
        }, 2000);
    });
}

// Close registration modal
const closeRegisterBtn = document.getElementById("closeRegisterBtn");
if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener("click", closeRegisterModal);
}

function closeRegisterModal() {
    const registerModal = document.getElementById("registerModal");
    if (registerModal) {
        registerModal.style.display = "none";
    }
}

// Close modal when clicking outside
const registerModal = document.getElementById("registerModal");
if (registerModal) {
    registerModal.addEventListener("click", (event) => {
        if (event.target === registerModal) {
            closeRegisterModal();
        }
    });
}
