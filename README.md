# ICT Service Request Management System

## Project Name

**SAD-ServiceRequest-laput**

## Description

The **ICT Service Request Management System** is a web-based system designed to help users submit and manage ICT-related service requests.

Users can create a service request by providing their name, department, category, description, and priority. The system uses **Supabase** for authentication and database storage.

## Features

* User Registration
* User Login
* User Logout
* Create Service Request
* View Service Requests
* Edit Service Request
* Delete Service Request
* Refresh Service Requests
* Priority Selection
* Request Status
* Supabase Database Integration
* Row Level Security (RLS)

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Supabase
* VS Code
* Live Server

## Project Structure

```text
SAD-ServiceRequest-Montero/
│
├── index.html
├── login.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── supabase.js
│   ├── auth.js
│   └── app.js
│
└── README.md
```

## Database

The system uses a Supabase table named:

```text
service_requests
```

The table contains the following fields:

| Field          | Type        | Description                  |
| -------------- | ----------- | ---------------------------- |
| id             | BIGINT      | Unique request ID            |
| requester_name | TEXT        | Name of the requester        |
| department     | TEXT        | Requester's department       |
| category       | TEXT        | ICT request category         |
| description    | TEXT        | Description of the problem   |
| priority       | TEXT        | Request priority             |
| status         | TEXT        | Current request status       |
| created_at     | TIMESTAMPTZ | Date and time created        |
| user_id        | UUID        | ID of the authenticated user |

## Request Categories

The system supports the following categories:

* Hardware
* Software
* Network
* Account
* Other

## Priority Levels

The available priority levels are:

* Low
* Medium
* High
* Urgent

## Request Status

The system uses the following request statuses:

* Pending
* In Progress
* Completed
* Cancelled

## Supabase Configuration

The Supabase project is connected through:

```javascript
const SUPABASE_URL =
    "https://mtvrykvffbudxcvvscel.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_bdCD5Ne8q_gWX9-KELl1Zw_X5QpxpMC";
```

The URL used by `supabase.js` should be the main Supabase project URL.

Do **not** add `/rest/v1` to the URL when using `supabase.createClient()`.

Example:

```javascript
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
```

## Database Setup

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Create a new SQL query.
4. Paste the database SQL code.
5. Click **Run**.
6. Check **Table Editor**.
7. Look for the `service_requests` table.

The system uses Row Level Security (RLS) to control access to service requests.

## How to Run the Project

### Step 1: Open the Project

Open the `SAD-ServiceRequest-Montero` folder in **Visual Studio Code**.

### Step 2: Install Live Server

Install the **Live Server** extension in VS Code.

### Step 3: Start the System

Right-click:

```text
login.html
```

Then select:

```text
Open with Live Server
```

The system will open in your browser.

Example:

```text
http://127.0.0.1:5500/login.html
```

### Step 4: Create an Account

On the login page, click:

```text
Create Account
```

Enter an email and password.

If email confirmation is enabled in Supabase, check the email and confirm the account.

### Step 5: Login

Enter the registered email and password, then click:

```text
Login
```

After successful login, the system will open the Service Request page.

### Step 6: Create a Service Request

Fill in:

* Requester Name
* Department
* Category
* Description
* Priority

Then click:

```text
Submit Request
```

The request will be saved in the Supabase database.

## CRUD Operations

The system supports basic CRUD operations:

### Create

Users can create a new ICT service request.

### Read

Users can view existing service requests.

### Update

Users can edit the description of their own service request.

### Delete

Users can delete their own service request.

## Security

The system uses **Supabase Authentication** for user login and registration.

Row Level Security (RLS) is enabled on the `service_requests` table.

Users can only update or delete requests associated with their own account.

The browser uses a **Supabase publishable key**. A Supabase secret/service-role key should never be placed in frontend JavaScript.

## Troubleshooting

### Login does not work

Check the following:

1. Supabase Authentication is enabled.
2. Email provider is enabled.
3. The user account exists in Supabase.
4. The email and password are correct.
5. `js/supabase.js` contains the correct project URL and publishable key.

### Service requests are not loading

Check:

1. The `service_requests` table exists.
2. The SQL setup was successfully executed.
3. RLS policies were created.
4. The user is logged in.
5. The browser Console for JavaScript errors.

### "Failed to fetch" error

Check your internet connection and make sure the Supabase project URL is correct.

The URL should look like:

```text
https://your-project-id.supabase.co
```

Do not use:

```text
https://your-project-id.supabase.co/rest/v1/
```

inside `supabase.createClient()`.

## Project Purpose

This project demonstrates how a web-based ICT Service Request Management System can be developed using HTML, CSS, JavaScript, and Supabase.

It provides a simple way for users to submit, view, update, and delete ICT service requests while using authentication and database security.

## Author

**Rechiel Laput**

## Project Type

**Service Request Management System**

## Development Tools

**Visual Studio Code + Supabase + Live Server**

**ERD**
<img width="1200" height="760" alt="image" src="https://github.com/user-attachments/assets/5353da18-2e09-40e5-a038-9b454ba425a5" />

