# Company Resource Management Dashboard

A powerful web application designed to simplify the management of company resources and employee accounts. Built with a React frontend and a Node.js backend, this dashboard provides administrators with intuitive tools for creating employee accounts, assigning specific permissions, and automating reminders for resource validity and inspection deadlines via email.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Employee Management:**  
  Administrators can create, update, and remove employee accounts.

- **Granular Permission Control:**  
  Assign fine-grained permissions (read, edit, add, delete) to control access to company resources.

- **Resource Oversight:**  
  Manage various company assets including protective equipment and meters.

- **Automated Email Notifications:**  
  The system sends timely email alerts for upcoming or expiring deadlines related to resource validity and inspections using Nodemailer.

- **User-Friendly Dashboard:**  
  A sleek and intuitive interface built with React ensures ease-of-use for both administrators and users.

---

## Technology Stack

- **Frontend:** React
- **Backend:** Node.js (with Express)
- **Email Service:** Nodemailer
- **Database:** PostgreSQL

---

## Key User Workflows
**Admin Panel:**
- Log in with administrative credentials.
- Create and manage employee accounts.
- Assign and modify user permissions for resource management.
**User Interface:**
- Depending on granted permissions, users can view, edit, add, or remove company resources.
**Automated Reminders:**
- The system monitors resource deadlines and sends email alerts for upcoming or expired validity and inspection dates.
