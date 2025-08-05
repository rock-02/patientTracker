# Design Document for patientTracker

---

## 1. Tech Stack Choices

### a) Frontend Framework
- **Framework Used:** React.js  
- **Why Chosen:**  
  - Efficient for building interactive, responsive single-page applications.
  - Large ecosystem and community support.
  - Component-based architecture promotes reuse and maintainability.
  - Integrates well with RESTful APIs for dynamic data.

### b) Backend Framework
- **Framework Used:** Spring Boot (Java)  
- **Why Chosen:**  
  - Robust and scalable REST API development.
  - Mature ecosystem for security, validation, and database integration.
  - Dependency injection and modularity for maintainable codebases.
  - Good fit for enterprise and data-centric applications.

### c) Database
- **Database Used:** MySQL  
- **Why Chosen:**  
  - Relational model fits users, patients, and files relationships.
  - ACID compliance ensures data integrity and reliability.
  - Well-supported by Spring Boot and easy to manage.

### d) Scaling for 1000+ Users
- **Improvements to Consider:**  
  - Use a database connection pool (e.g., HikariCP) for efficient DB access.
  - Move file storage to cloud (e.g., AWS S3) for better performance and scalability.
  - Add caching (e.g., Redis) for frequent queries.
  - Deploy multiple backend instances behind a load balancer.
  - Optimize database indexing and queries.
  - Use async/background processing for heavy file operations.
  - Implement monitoring and alerting.

---

## 2. System Flow

### Flow Description (Bullets)
- **Frontend (React):**  
  - User logs in and uploads/downloads documents.
  - Sends authenticated HTTP requests to backend, displays responses and file lists.
- **Backend (Spring Boot):**  
  - Handles authentication, file upload/download, and user-specific queries.
  - Uses Spring Security with JWT for authentication/authorization.
  - Stores uploaded files in a local `uploads` directory.
  - Stores file metadata and user info in MySQL.
- **Database (MySQL):**  
  - Stores users, file metadata, and relationships.
- **File Storage:**  
  - Uploaded PDF files stored in a dedicated folder on the backend server.

### Security Flow

- **Public Routes:**  
  - Routes starting with `/auth` (e.g., `/auth/login`, `/auth/signup`) are public.
- **Private Routes:**  
  - All routes starting with `/api` or others not under `/auth` are private.
  - Private routes require a valid JWT token provided in the `Authorization` header.
  - For each request, Spring Security validates this token:
    - If **valid and not expired**, access is granted.
    - If **invalid or expired**, returns an error (e.g., "Invalid token", "Token expired").
    - If the user tries to access resources not belonging to them, returns **403 Forbidden**.

### Simple ASCII Diagram

```
[User] 
   |
   v
[Frontend (React)]
   |
   v
[Backend (Spring Boot) + Spring Security] <---> [MySQL Database]
   |
   v
[File Storage (uploads directory)]
```

---

## 3. API Specification

| URL                                        | HTTP Method | Description                                                    | Auth Required |
|---------------------------------------------|-------------|----------------------------------------------------------------|--------------|
| `/auth/signup`                              | **POST**    | User registration                                              | No           |
| `/auth/login`                               | **POST**    | User login                                                     | No           |
| `/api/documents/upload`                     | **POST**    | Upload a file                                                  | Yes          |
| `/api/documents/{id}`                       | **GET**     | Download a file (if uploaded by logged-in user)                | Yes          |
| `/api/documents`                            | **GET**     | List files for logged-in user                                  | Yes          |
| `/api/documents/{id}`                       | **DELETE**  | Delete a file (if uploaded by logged-in user)                  | Yes          |

---

### Upload File

- **URL:** `POST http://localhost:8081/api/documents/upload`
- **Method:** POST
- **Auth Required:** Yes (JWT token in `Authorization` header)
- **Sample Request:**  
  - `Content-Type: multipart/form-data`
  - Form field: `file` (PDF)
- **Sample Response:**  
  ```json
  {
      "fileName": "ospp-chap02-part5.pdf",
      "message": "File uploaded successfully"
  }
  ```
- **Description:**  
  Upload a PDF file for the logged-in user; stores file in the server and metadata in the database.

---

### Download File

- **URL:** `GET http://localhost:8081/api/documents/{id}`
- **Method:** GET
- **Auth Required:** Yes (JWT token in `Authorization` header)
- **Sample Response:**  
  - Returns the PDF file as a download.
- **Description:**  
  Downloads the file with the specified ID **only if it was uploaded by the logged-in user**.  
  Unauthorized access to other users’ files is not permitted.

---

### List Files

- **URL:** `GET http://localhost:8081/api/documents`
- **Method:** GET
- **Auth Required:** Yes (JWT token in `Authorization` header)
- **Sample Response:**  
  ```json
  [
      {
          "id": 5,
          "fileName": "Chapter 2 (1).pdf",
          "uploadDate": "2025-08-05T21:19:35.671+00:00",
          "fileSize": 1159689,
          "user": {
              "id": 2,
              "email": "john.doe@example.com",
              "name": "John Doe",
              "password": null,
              "phone": "9876543210",
              "city": "Bangalore",
              "country": "India",
              "state": "Karnataka",
              "pincode": "560001",
              "createdAt": null
          }
      }
  ]
  ```
- **Description:**  
  Lists all reports uploaded by the currently authenticated user **only**.

---

### Delete File

- **URL:** `DELETE http://localhost:8081/api/documents/{id}`
- **Method:** DELETE
- **Auth Required:** Yes (JWT token in `Authorization` header)
- **Sample Response:**  
  ```
  File deleted successfully
  ```
- **Description:**  
  Deletes the file and its metadata **only if it was uploaded by the logged-in user**.  
  Users cannot delete files uploaded by others.

---

### User Signup

- **URL:** `POST http://localhost:8081/auth/signup`
- **Method:** POST
- **Auth Required:** No
- **Sample Request:**  
  ```json
  {
    "email": "john.doe@example2.com",
    "name": "John Doe",
    "password": "password124",
    "phone": "9876543210",
    "city": "Bangalore",
    "country": "India",
    "state": "Karnataka",
    "pincode": "560001"
  }
  ```
- **Sample Response:**  
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "message": "User registered successfully"
  }
  ```
- **Description:**  
  Registers a new user and returns a JWT token on success.

---

### User Login

- **URL:** `POST http://localhost:8081/auth/login`
- **Method:** POST
- **Auth Required:** No
- **Sample Request:**  
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Sample Response:**  
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "message": "User logged in successfully"
  }
  ```
- **Description:**  
  Authenticates a user and returns a JWT token for use in further requests.

---

## 4. Data Flow Description

- The user logs in and is authenticated (session or token).
- User uploads a PDF file via the frontend.
- The frontend sends a multipart/form-data request to the backend with the file.
- Backend validates, saves the file in the `uploads` folder, and records metadata (including user ID) in MySQL.
- When listing files, backend queries MySQL for files belonging to the logged-in user and returns metadata.
- When downloading or deleting, backend **verifies file ownership** before proceeding; only the uploader can download or delete their files.
- For every request to a private route, Spring Security checks the JWT token validity; if invalid/expired, it returns 401 (Unauthorized) or a relevant error. If the user is not the owner of the resource, returns 403 (Forbidden).

---

## 5. Assumptions

- **Authentication:**  
  - Only logged-in users can upload, list, download, or delete documents.
- **Guest Login:**  
  - For local development, a patient account with credentials `guest@gmail.com` / `guest@1234` should be created first in MySQL for initial access and testing.  
  - This user must exist in the DB before other actions can be performed.
- **File Size Limits:**  
  - Maximum upload size is limited via Spring Boot configuration, e.g., 10MB.
- **File Types:**  
  - Only PDF uploads are accepted for security and standardization.
- **Error Handling:**  
  - All endpoints return clear error messages and HTTP status codes.
  - Attempting to access or delete files not uploaded by the current user returns a 403 Forbidden error.
  - Invalid or expired JWT tokens return appropriate authentication errors.
- **File Storage:**  
  - Files are stored in a local `uploads` directory for development; can migrate to cloud for production.
- **User Data:**  
  - Each file is associated with a user; **only the owner can view, download, or delete their files**.

---