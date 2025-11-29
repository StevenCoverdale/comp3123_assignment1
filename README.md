COMP3123 Assignment 1 + Assignment 2 = Employee Management App
----------------------------------------------

This project is a simple MERN-based employee management system.  
It builds on the Assignment 2 backend (JWT auth + REST API) and adds a React frontend so the whole thing works as a full application.

The app lets you:
- Sign up and log in (JWT authentication)
- View all employees
- Add new employees
- Edit employees (click any row to open the edit modal- NO SPECIFIC BUTTON)
- Delete employees
- Upload a profile picture for each employee
- Search employees in real time

The backend uses Node, Express, MongoDB, and Multer for file uploads.  
The frontend uses React, React Router, React Query, and Axios.

----------------------------------------------
Sample Login (Seeded User)
----------------------------------------------
email: johndoe@example.com
password: password123

This user is preloaded in the database for marking.

----------------------------------------------
Running with Docker
----------------------------------------------

1. Make sure Docker Desktop is running
2. From the project root (where docker-compose.yml is):
   docker compose up --build

After it starts:
Backend is available at:  http://localhost:3000
Frontend is available at: http://localhost:8081
MongoDB runs inside the container


----------------------------------------------
API Notes
----------------------------------------------
All backend routes are under /api/v1.

Auth:
POST /user/signup  
POST /user/login  

Employees:
GET /emp/employees  
GET /emp/employees/search  
POST /emp/employees  
PUT /emp/employees/:id  
DELETE /emp/employees/:id  

----------------------------------------------
Extra Notes for Marker
----------------------------------------------
- JWT auth is fully implemented.
- Employee routes are protected.
- Image upload works (Multer).
- Clicking a table row opens the edit modal (hidden update button).
- React Query handles caching and refetching.
- MongoDB seeded with sample user.
- UI is simple and functional.
