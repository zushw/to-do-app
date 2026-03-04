# Overview

The project is a web-based task management system (To-Do List) designed to allow users to organize their daily lives through categories, while also enabling collaborative work through task sharing.


## Requirements Gathering

### Functional Requirements

- Account creation and user authentication (Login/Logout).
- Full CRUD for tasks.
- CRUD for categories to organize tasks.
- Task sharing functionality between users.
- Task status toggling (Completed / Not completed).
- Task filtering (by status or category).
- Pagination in the task list.
- Integration with an external API.

### Non-Functional Requirements

- Security: 
    - User passwords must be hashed.
    - Users can only access, modify, or delete their own tasks.
- Performance: API response times must be optimized utilizing pagination.
- Usability: The user interface must be responsive.
- Maintainability: The codebase must be modular, adhering to design patterns and best practices (SOLID, DRY, KISS) to ensure future scalability and ease of maintenance.
- Availability & Portability: The system must be easily portable and capable of running consistently across different environments.

## Tech Stack

- Backend: Developed in Python using Django REST Framework.
- Frontend: Developed in ReactJS.
- Quality: Unit tests in the backend using ```pytest``` and E2E tests in frontend using ```Selenium```.
- Infrastructure: Fully containerized application using Docker and Docker Compose.
- DevOps: CI/CD Pipeline configured for continuos code validation. 
- Deploy: Cloud hosting (AWS or Azure).

## Database Architecture

### Entities and Relationships

1. User:
    - Handled by Django's default authentication system.
    - Fields: ```id```, ```username```, ```email```, ```password```.

2. Category:
    - User to group and organize tasks.
    - Fields:
        - ```id``` (Primary Key)
        - ```name``` (String, max 100 chars)
        - ```owner``` (Foreign Key -> ```User```): Ensures users only see their own categories.

3. Tasks:
    - The core entity of the application.
    - Fields: 
        - ```id``` (Primary Key)
        - ```title``` (String, max 200 chars)
        - ```description``` (Text, optional)
        - ```is_completed``` (Boolean, default: False)
        - ```created_at``` (DateTime, auto-generated)
        - ```category``` (Foreign Key -> ```Category```, optional)
        - ```owner``` (Foreign Key -> ```User```): The creator of the task.
        - ```shared_with``` (ManyToMany -> ```User```): Allows multiple users to view/interact with the task.