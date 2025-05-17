# Edunova-School-System App

## Overview

This web application was developed by **SFG Group W** as part of a software engineering project. It is designed to facilitate communication and service access for **students, lecturers, and administrators** within an academic environment.

The platform supports core features such as service bookings, timetable viewing, maintenance reporting, and notification management, all managed through a role-based access control system.

---
## Project Structure
- Landing Page → Authentication (Sign In / Sign Up / Confirm) → Main App
- Sidebar + Top Header (Profile Info, Role, Report Issue)
- Main Pages: Dashboard, Appointments, Timetable, Notifications, User Profiles, Report Issues

## Setup
1. Clone the repository:
    ```
    git clone <repository-url>
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start the development server:
    ```
    npm run dev
    ```

## Features

### 🔐 User Authentication
- Secure login for Students, Lecturers, and Admins
- Role-based access control (RBAC)

### 📅 Timetable Viewing
- Students view their timetables based on faculty
- Static/preloaded data
- View-only for students

### 📢 Notifications
- Lecturers can create announcements
- Students can view notifications
- Real-time update support (preferred)

### 📓 Service Booking
- Students book appointments with lecturers
- Lecturers manage and approve bookings (optional)

### 🛠️ Maintenance Reporting
- Students submit maintenance issues via simple forms
- Lecturers can view submissions

### 📊 Dashboard & Analytics
- Visual data representation (charts, counts, etc.)
- Core metrics: bookings, issues, usage
- Exportable reports (PDF/CSV)

---

## Additional Requirements

- ✅ Responsive Design for all devices
- 📍 Geolocation for Room Availability *(optional via Firebase)*
- 🧪 Unit & Integration Testing
- ☁️ Cloud Deployment (RedHat JBoss)
- 📘 Full Technical Documentation (UML, SRS)

---

## Technologies Used

| Area             | Stack / Tools                          |
|------------------|----------------------------------------|
| Frontend         | React, Firebase                        |
| Backend          | Java, JBoss, MySQL, RESTful APIs       |
| Testing          | Postman, Manual & Automated Tests      |
| Documentation    | UML (Visio), SRS, Markdown             |
| Version Control  | Git                                    |
| Deployment       | RedHat JBoss (separate frontend/backend)|

---

## Development Highlights

- CRUD operations for Booking and Maintenance modules
- Role-based UI rendering
- Clean, minimalist UI/UX for better usability
- Modular code for easier testing and updates
- Optional features implemented as time allows
- Daily Git commits with structured version control
- Team collaboration maintained through regular meetings and planning

---

## Team Contributors

- 👨‍💻 **G. Sibiya** – Frontend Development, Firebase Integration  
- ⚙️ **Paul** – Backend Development, Deployment  
- 🧪 **Lebo Raphela** – Testing, Documentation, SRS, Quality Control  


## Notes

This repository contains only the codebase. For documentation and UML diagrams, please refer to the accompanying project folder or reach out to the team.

---

## License

This project is intended for academic purposes only and is not licensed for commercial use.