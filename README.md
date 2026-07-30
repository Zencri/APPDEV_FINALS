# BorrowBox - APPDEV Final Project

This is a recreation of the BorrowBox inventory and borrowing application built for my final activity in Application Development (APPDEV).

The project demonstrates a completely unified workflow combining a SQLite Database, a Django REST Framework API, and a custom HTML/Vanilla JavaScript frontend. It features full CRUD operations for users, items, and borrowing requests, as well as role-based access control.

## Project Structure
- `api/` & `BorrowBoxAPI/` - The Django REST Framework backend
- `db.sqlite3` - The seeded SQLite database
- `js/` - Frontend JavaScript files connecting the UI to the API
- `*.html` - Frontend UI pages

## How to Run the Application

This project runs locally using the Django development server. Please follow these steps to run the application on your machine:

### 1. Prerequisites
Make sure you have Python installed on your system. 

### 2. Set up the Environment
Open a terminal in this project folder and run the following commands to create a virtual environment and install the required dependencies:

**For Windows:**
```bash
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
```

**For Mac/Linux:**
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 3. Run the Backend Server
The database (`db.sqlite3`) is already included and seeded with sample data, so you do not need to run migrations. Just start the server:

```bash
python manage.py runserver
```
*Note: Make sure the server runs on port 8000 (`http://127.0.0.1:8000/`), as the frontend JavaScript relies on this default API port.*

### 4. Access the Frontend
Once the server is running, you can access the application by opening the following HTML file directly in your web browser:
`signin.html`

### 5. Login Credentials
You can use the following seeded accounts to test the Role-Based Access Control and workflows:

**Administrator Account:**
- **Username:** `admin`
- **Password:** `admin123`
*(Has access to the Dashboard, User Management, Item Management, and can approve/reject/return Borrowing Requests).*

**Normal User Account:**
- **Username:** `user`
- **Password:** `user123`
*(Can browse the Item Masterfile, Request to Borrow items, and view their personal borrowing history).*

---

### Features Implemented (Grading Rubric)
- **Backend/API:** Fully functional DRF API serving data securely.
- **Database:** SQLite correctly storing relational tables.
- **Create:** Ability to add new Users, Items, Categories, and Borrowing Requests.
- **Read:** Dynamic data tables and item catalog grid.
- **Update:** Ability to edit Items/Users and manage Borrowing Statuses.
- **Delete:** Ability to safely delete records (with Foreign Key protections).
- **Frontend Integration:** Complete asynchronous API integration using `fetch()` with custom Toast Notifications.
