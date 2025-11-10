# SmartPark – Fullstack Smart Parking Web Application

## Introduction

**SmartPark** is a **fullstack PERN (PostgreSQL, Express.js, React, Node.js)** web application prototype designed to simulate a **smart parking management system**.  
It helps users find available parking slots and enables administrators to manage parking data in real time through a web dashboard.  

This project was developed as part of the **Fullstack Developer Intern Case Study**, demonstrating end-to-end design — from backend API development to frontend integration and database management.

---

## Project Goals

- Create a scalable, maintainable, and testable fullstack web application.
- Implement clean RESTful API design with authentication and access control.
- Simulate IoT-based real-time parking slot updates through admin interactions.
- Provide intuitive interfaces for **Users** and **Admins**.

---

## Minimum Viable Product (MVP) Features

### Authentication
- User registration and login (JWT-based)
- Admin login (session-based)

### Admin Functions
- Create, modify, and delete buildings
- Create, modify, and delete parking lots
- Manually toggle slot occupancy (IoT simulation)
- Add/remove slots in lot grid layout

### User Functions
- View occupancy summary per building and floor
- View lot detail (grid visualization of slots)

### Data Initialization
- Seed database with 2 buildings and 10–15 slots per lot
- Auto-seeding via `npm run seed`

## Architecture & Database Design

- Frontend: React SPA
- Backend: Node.js + Express.js REST API
- Database: PostgreSQL
- Authentication: JWT (user), Session (admin)

## Use Case Diagram

![Use Case Diagram]

## Use Case Tables

### View Home Page

| Use Case | View Home Page |
|---|---|
| Actors | Web client |
| Summary | Displays the home page. |
| Preconditions | Web client is not logged in as a user. |
| Main Flow | 1. Web client requests the home page.<br>2. The home page is displayed, which includes a "Login" and a "Register" button. |
| Postconditions | The home page is displayed. |

### User Registration

| Use Case | User Registration |
|---|---|
| Summary | Allows a visitor to create an account with username and password. |
| Actors | Web client |
| Precondition | Web client is at the home page. |
| Main Flow | 1. Web client opens registration page by clicking the register button.<br>2. Web client inputs username and password.<br>3. Validate data.<br>4. Hash the inputted password with salt.<br>5. Creates a new user with the inputted username and hashed password.<br>6. Returns success message.<br>7. Redirect Web client to the login page. |
| Alternate Flow | A: At step 2 of the main flow, if the username has been used by another user, print an error and return to step 1.<br>B: At step 2 of the main flow, if the password length is less than 8 characters, print an error and return to step 1. |
| Postcondition | A new User record is stored in the database, and its credential can be used to log in as a User. Web client is redirected to the login page. |

### User Login

| Use Case | User Login |
|---|---|
| Actors | Web client |
| Summary | Authenticates an existing user and issues a User JWT Token. |
| Preconditions | Web client is at the home page or is being redirected to the login page from the user registration process. |
| Main Flow | 1. Web client opens login page by clicking the login button.<br>2. Web client inputs their username and password.<br>3. Hash the inputted password with salt.<br>4. Validate username and hashed password as a pair.<br>5. On success, return a User JWT Token.<br>6. Redirect to user dashboard. |
| Alternate Flow | A: If the Web client is redirected to the login page after finishing the user registration process, skip step 1.<br>B: At step 4 of the main flow, if the username and hashed password pair is incorrect, print an error, and returns to step 1. |
| Postconditions | Web Client is logged in as a User and is issued a User JWT Token. |

### Admin Login

| Use Case | Admin Login |
|---|---|
| Actors | Web client |
| Summary | Authenticates an existing admin and issues an Admin session ID. |
| Preconditions | Web client is at the admin login page. |
| Main Flow | 1. Web client enters admin ID and password.<br>2. Hash the inputted password with salt.<br>3. Validate username and hashed password.<br>4. On success, return an admin session ID.<br>5. Redirect to admin dashboard. |
| Alternate Flow | A: At step 3 of the main flow, if the username and hashed password pair is incorrect, print an error, and returns to step 1. |
| Postconditions | Web Client is logged in as an Admin and is issued an Admin session ID. |

### View User Dashboard

| Use Case | View User Dashboard |
|---|---|
| Actors | User |
| Summary | Displays the user dashboard. |
| Preconditions | Logged in as a user. |
| Main Flow | 1. User requests the user dashboard page.<br>2. Display the user dashboard page, which contains a "View Lot Detail" button. |
| Postconditions | The user dashboard page is displayed. |

### View Availability

| Use Case | View Availability |
|---|---|
| Actors | User |
| Summary | Displays the availability of every parking lot. |
| Preconditions | Logged in as a user. User is at the user dashboard page. |
| Main Flow | 1. User opens the lot availability overview by clicking on the "View Availability" button.<br>2. Run Get Lots Overview Function<br>3. Display retrieved data in the appropriate field.<br>4. User closes the lot availability overview by clicking on the close button. |
| Postconditions | The lot availability overview is closed after being displayed. |

### Lot Detail View

| Use Case | Lot Detail View |
|---|---|
| Actors | User |
| Summary | Displays detailed information of a lot, including the visualization and status of all slots in that lot. |
| Preconditions | Logged in as a user. The lot availability overview is being displayed. |
| Main Flow | 1. User opens the Lot Detail Page of a parking lot by clicking on the "View Lot Detail" button of a parking lot.<br>2. Run the Get Lot Detail Function.<br>3. Display the Lot Detail page, showing the name (building name and floor name), along with the occupancy status of each parking lot in a grid view. |
| Postconditions | The Lot Detail page of the requested parking lot is displayed. |

### User Logout

| Use Case | User Logout |
|---|---|
| Actors | User |
| Summary | Log out a user by removing the User JWT Token. |
| Preconditions | User is at the User dashboard page, User Lot Detail page, or User Lots Overview page. |
| Main Flow | 1. User clicks the log out button.<br>2. Remove the User's associated JWT Token.<br>3. Redirect to home page. |
| Postconditions | User is logged out and is redirected to the home page. |

### Get Lots Overview

| Use Case | Get Lots Overview |
|---|---|
| Actors | User |
| Summary | Returns a list of floor name and availability of every parking lot, grouped by building. |
| Preconditions | Logged in as a User or as an Admin. |
| Main Flow | 1. Query the ID, building ID, and floor name of every lot; grouped by building ID.<br>2. Query the number of vacant slot, grouped by lot ID foreign key.<br>3. Query the ID and name of every building.<br>4. Process retrieved data into an element. This element lists every parking lot, with the number of vacant slots in that lot, and the "View Lot Detail" button; grouped by building.<br>5. Return the created element. |
| Alternate Flow | A: At step 1 of the main flow, if there are no entries in the parking lot table, return a heading informing the lack of items.<br>B: At step 4 of the main flow, if there is any building with no child parking lot, a text informing that there's no parking lot is available in this building is displayed in that building's group. |
| Postconditions | The element with the availability information of every parking lot in every building is returned. |

### Get Lot Detail

| Use Case | Get Lot Detail |
|---|---|
| Actors | User |
| Summary | Returns detailed information of a lot in the form of a element. |
| Preconditions | Logged in as a User or as an Admin. The ID of the requested lot information is defined. |
| Main Flow | 1. Query the building ID and floor name of the parking lot with the defined lot ID.<br>2. Query the status and coordinate of all slots referencing the defined lot ID.<br>3. Query the building name with the corresponding building ID.<br>4. Creates a grid view of all of the slots, color-coding each slots according to its status.<br>5. Creates a element displaying referenced building name, lot floor name, and grid view of the slots.<br>6. Returns the created element. |
| Alternate Flow | A: At step 2 of the main flow, if the query yields no entry, return a heading informing that the lot is not usable. |
| Postconditions | The Lot Detail element of the requested parking lot is returned. |

### View Admin Dashboard

| Use Case | View Admin Dashboard |
|---|---|
| Actors | Admin |
| Summary | Displays the admin dashboard. |
| Preconditions | Logged in as an Admin. |
| Main Flow | 1. Admin requests the admin dashboard page.<br>2. Display the admin dashboard page. |
| Postconditions | The admin dashboard page is displayed. |

### Admin View Availability

| Use Case | View Availability |
|---|---|
| Actors | Admin |
| Summary | Displays the availability of every parking lot, along with the option to create a new lot and delete an existing one. |
| Preconditions | Logged in as a admin. Admin is at the admin dashboard page. |
| Main Flow | 1. Admin opens the admin lot availability overview by clicking on the "View Availability" button.<br>2. Run Get Lots Overview Function<br>3. Insert a "Delete Lot" button at the end of each lot rows and a "Delete Building" button at the end of each building group in the retrieved data.<br>4. Display a "Create Lot" and a "Create Building" button and the modified retrieved data<br>5. Admin closes the admin lot availability overview by clicking on the close button. |
| Alternate Flow | A: At step 4 of the main flow, if the "Delete Lot" button is pressed, run the Delete Lot Function with the corresponding lot's ID as an argument. Then, return to step 2.<br>B: At step 4 of the main flow, if the "Delete Building" button is pressed, run the Delete Building Function with the corresponding buuilding's ID as an argument. Then, return to step 2. |
| Postconditions | The admin lot availability overview is closed after being displayed. |

### Delete Lot

| Use Case | Delete Lot |
|---|---|
| Actors | Admin |
| Summary | Deletes a lot with the defined lot ID. |
| Preconditions | Logged in as as an Admin. The lot ID of is defined. |
| Main Flow | 1. Authorize admin privilege.<br>2. Query the deletion of the lot with the defined lot ID. |
| Alternate Flow | At step 1 of the main flow, if the authorization fails, return an error. |
| Postconditions | The lot with the defined ID is deleted. |

### Create Lot

| Use Case | Create Lot |
|---|---|
| Actors | Admin |
| Summary | Allows an admin to create a new lot with building ID and floor name. |
| Preconditions | Logged in as as an Admin. Admin is at the admin lot availability overview. |
| Main Flow | 1. Admin opens create lot page by clicking the "Create Lot" button.<br>2. Authorize admin privilege.<br>3. Query the building ID and name from the building table.<br>4. Admin picks building name and inputs floor name.<br>5. Validate data.<br>6. Creates a new lot with building ID and floor name. 7. Redirect Admin to the admin dashboard. |
| Alternate Flow | A: At step 2 of the main flow, if the authorization fails, return an error.<br>B: At step 3 of the main flow, if no building exist, print an error.<br>At step 5 of the main flow, if any data is invalid, print an error and return to step 4. |
| Postconditions | A new lot with building ID and floor name is created. |

### Modify Lot Information

| Use Case | Modify Lot Information |
|---|---|
| Actors | Admin |
| Summary | Allows admin to change a parking lot's information. |
| Preconditions | Logged in as an Admin. The Admin Lot Detail Page is being displayed. |
| Main Flow | 1. Admin opens modify lot page by clicking the "Modify Lot" button.<br>2. Authorize admin privilege.<br>3. Query the building ID and name from the building table.<br>4. Admin picks new building name and inputs new floor name.<br>5. Validate data.<br>6. Creates a new lot with building ID and floor name.<br>7. Redirect Admin to the admin dashboard. |
| Alternate Flow | A: At step 2 of the main flow, if the authorization fails, return an error.<br>B: At step 5 of the main flow, if any data is invalid, print an error and return to step 4.<br>C: At step 5 of the main flow, if the building name and floor name is the same as the previous one, go to step 7. |
| Postconditions | The information of the selected parking lot is changed according to the input. |

### Delete Building

| Use Case | Delete Building |
|---|---|
| Actors | Admin |
| Summary | Deletes a building with the defined building ID. |
| Preconditions | Logged in as as an Admin. The building ID of is defined. |
| Main Flow | 1. Authorize admin privilege.<br>2. Query the deletion of the building with the defined building ID. |
| Alternate Flow | A: At step 1 of the main flow, if the authorization fails, return an error. |
| Postconditions | The building with the defined ID is deleted. |

### Create Building

| Use Case | Create Building |
|---|---|
| Actors | Admin |
| Summary | Allows an admin to create a new building with building name. |
| Preconditions | Logged in as as an Admin. Admin is at the admin lot availability overview. |
| Main Flow | 1. Admin opens Create Building page by clicking the register button.<br>2. Authorize admin privilege.<br>3. Admin inputs building name.<br>4. Validate data.<br>5. Creates a new lot with building ID and floor name.<br>6. Redirect Admin to the admin dashboard. |
| Alternate Flow | A: At step 2 of the main flow, if the authorization fails, return an error.<br>At step 4 of the main flow, if the building name is already being used, print an error and return to step 3. |
| Postconditions | A new building with the inputted building name is created. |

### Modify Building

| Use Case | Modify Building |
|---|---|
| Actors | Admin |
| Summary | Allows admin to change a building's information. |
| Preconditions | Logged in as an Admin. Admin is at the admin lot availability overview. |
| Main Flow | 1. Admin opens modify building page by clicking the "Modify Building" button.<br>2. Authorize admin privilege.<br>3. Admin picks new building name and inputs new floor name.<br>4. Validate data.<br>5. Creates a new lot with building ID and floor name.<br>6. Redirect Admin to the admin dashboard. |
| Alternate Flow | A: At step 2 of the main flow, if the authorization fails, return an error.<br>B: At step 4 of the main flow, if any data is invalid, print an error and return to step 4.<br>C: At step 4 of the main flow, if the building name is the same as the previous one, go to step 6. |
| Postconditions | The information of the selected parking lot is changed according to the input. |

### Admin Lot Detail

| Use Case | Admin Lot Detail |
|---|---|
| Actors | Admin |
| Summary | Displays detailed information of a lot, including the visualization and status of all slots in that lot. Also provides option to manage slots and change lot layout. |
| Preconditions | Logged in as an Admin. The admin lot availability overview is being displayed. |
| Main Flow | 1.Admin opens the Admin Lot Detail Page of a parking lot by clicking on the "View Lot Detail" button of a parking lot.<br>2. Run the Get Lot Detail Function.<br>3. Display the Lot Detail page, showing the name (building name and floor name), along with the occupancy status of each parking lot in a grid view. The "Manage Slots", "Modify Lot", and "Change Lot Layout" buttons is shown above the grid view. |
| Alternate Flow | A: At step 3 of the main flow, if no slots is present in the lot, the "Manage Slots" button is not shown. |
| Postconditions | The Admin Lot Detail page of the requested parking lot is displayed. |

### Slot Management

| Use Case | Slot Management |
|---|---|
| Actors | Admin |
| Summary | Allows admin to manually toggle slots' occupancy status. |
| Preconditions | Logged in as an Admin. The Admin Lot Detail Page is being displayed. |
| Main Flow | 1. Admin enters slot management mode for a parking lot by clicking on the "Manage Slot" button of a parking lot.<br>2. System authorizes admin privilege.<br>3. System displays the parking lot grid as a matrix of interactive slot buttons, allowing the Admin to toggle slot occupancy.<br>4. Admin clicks the "Save" button to submit pending changes.<br>5. System compiles a summary of to be changed slots (slot IDs and previous statuses).<br>6. System asks for Admin's confirmation to change occupancy status while displaying pending changes' details.<br>7. Admin confirms changes.<br>8. System implements changes.<br>9. System returns to the Admin Lot Detail page with updated slot statuses displayed. |
| Alternate Flow | A: At step 1 of the main flow, if no slot is present in the lot, return an error.<br>B: At step 2 of the main flow, if the authorization fails, return an error.<br>C1: At step 4 of the main flow, if admin clicks on any unmarked slot, mark that slot to be changed.<br>C2: At step 4 of the main flow, if admin clicks on any marked slot, unmark that slot to be changed.<br>D1: At step 4 of the main flow, if admin clicks on the "Discard" button, ask for confirmation to discard changes.<br>D2: After D1 of the alternate flow, if admin clicks on the "Confirm Discard" Button, exit slot management mode without applying changes.<br>D3: After D1 of the alternate flow, if admin clicks on the "Cancel Discard" Button, return to step 3.<br>E: At step 5 of the main flow, if the number of changed slots is 0, exit slot management mode without applying changes.<br>F: At step 7 of the main flow, if admin clicks on the "Cancel" button, return to step 3. |
| Postconditions | The Admin Lot Detail page for the selected parking lot is displayed, reflecting any applied changes. |

### Change Lot Layout

| Use Case | Change Lot Layout |
|---|---|
| Actors | Admin |
| Summary | Allows admin to change a parking lot's layout. |
| Preconditions | Logged in as an Admin. The Admin Lot Detail Page is being displayed. |
| Main Flow | 1. Admin enters change lot layout mode for a parking lot by clicking on the "Change Lot Layout" button of a parking lot.<br>2. System authorizes admin privilege.<br>3. System displays the parking lot grid as a matrix of interactive slot buttons, allowing the Admin to create and remove slots by coordinates.<br>4. Admin clicks the "Save" button to submit pending changes.<br>5. System compiles a summary of to be created and to be removed slots (slot IDs and previous statuses).<br>6. System asks for Admin's confirmation to change lot layout while displaying pending changes' details.<br>7. Admin confirms changes.<br>8. System implements changes.<br>9. System returns to the Admin Lot Detail page with updated slot statuses displayed. |
| Alternate Flow | A: At step 2 of the main flow, if the authorization fails, return an error.<br>B1: At step 4 of the main flow, if admin clicks on any slot, mark that slot for deletion.<br>B2: At step 4 of the main flow, if admin clicks on any marked slot, unmark that slot for deletion.<br>C1: At step 4 of the main flow, if admin clicks on any empty coordinate, mark that coordinate for slot creation.<br>C2: At step 4 of the main flow, if admin clicks on any marked empty coordinate, unmark that coordinate for slot creation.<br>D1: At step 4 of the main flow, if admin clicks on the "Discard" button, ask for confirmation to discard changes.<br>D2: After D1 of the alternate flow, if admin clicks on the "Confirm Discard" Button, exit slot management mode without applying changes.<br>D3: After D1 of the alternate flow, if admin clicks on the "Cancel Discard" Button, return to step 3.<br>E: At step 5 of the main flow, if the number of changed slots is 0, exit slot management mode without applying changes.F: At step 6 of the main flow, if any occupied slot is marked for deletion, display a large warning informing the number of marked occupied slots.<br>F: At step 7 of the main flow, if admin clicks on the "Cancel" button, return to step 3. |
| Postconditions | The Admin Lot Detail page for the selected parking lot is displayed, reflecting any applied changes. |

### Admin Logout

| Use Case | Admin Logout |
|---|---|
| Actors | Admin |
| Summary | Log out an admin by revoking the Admin session. |
| Preconditions | Admin is at the User dashboard page, Admin Lot Detail page, or Admin Lots Overview. |
| Main Flow | 1. Admin clicks the log out button.<br>2. Revoke the Admin's session.<br>3. Redirect to home page. |
| Postconditions | Admin is logged out and is redirected to the admin login page. |

## ERD / Schema Design (simplified)

![ER Diagram]

## Technology Choices & Justification

### Backend – Node.js + Express.js
- Non-blocking I/O and unified JavaScript stack  
- Middleware support (auth, validation, logging)  
- Common libraries: `express`, `pg`, `bcrypt`, `jsonwebtoken`

### Database – PostgreSQL
- Ideal for relational data (Building–Lot–Slot)  
- Ensures integrity through constraints and ACID compliance  

### Frontend – React
- Component-based SPA for responsiveness  
- State-driven UI with `axios` and `react-router-dom`  

### Security
- `bcrypt` for password hashing  
- `jsonwebtoken` for stateless user sessions  
- `helmet` for HTTP header hardening  

### Dev Tools
- `nodemon`, `concurrently`, `dotenv`, `Postman`

---

##  API Design Overview

RESTful API design. Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description | Auth |
|-----------|--------|--------------|------|
| `/auth/register` | POST | Register new user | Public |
| `/auth/login` | POST | User login | Public |
| `/admin/login` | POST | Admin login | Public |
| `/admin/logout` | POST | Admin logout | Admin |
| `/buildings` | GET | List all buildings | User/Admin |
| `/buildings:id` | GET | Get building info | User/Admin |
| `/buildings` | POST | Create new building | Admin |
| `/buildings/:id` | PUT | Modify building info | Admin |
| `/buildings/:id` | DELETE | Delete building | Admin |
| `/lots` | GET | List all lots | User/Admin |
| `/lots:id` | GET | Get lot info | User/Admin |
| `/lots` | POST | Create lot | Admin |
| `/lots/:id` | PUT | Modify lot info | Admin |
| `/lots` | DELETE | Delete lot | Admin |
| `/slots` | GET | List all slots, ordered | User/Admin |
| `/slots/availability` | GET | Get slots availability summary | User/Admin |
| `/slots/:id` | GET | Get slot info | User/Admin |
| `/slots` | POST | Create slot | Admin |
| `/slots` | PUT | Update slot | Admin |
| `/slots/:id/toggle` | PATCH | Toggle slot status | Admin |
| `/slots/:id` | DELETE | Delete slot | Admin |

All responses follow the pattern:
```json
{
  "status": "success",
  "message": "Action completed",
  "data": { ... }
}
```

## Results & Error Handling Analysis

All API errors are standardized using Express middleware:

```javascript
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
});

```

## Functional Testing & Demo

### Testing Tools

- Postman: API test collection
- pgAdmin: Database inspection
- Seed Script: Preloads sample data

### To Run Tests:

1. Import SmartPark_API_Collection.json into Postman

2. Set environment variable: {{base_url}} = http://localhost:5000

3. Run test sequence: Auth → Building → Lot → Slot

## Reproducibility & Running Instructions

### Requirements

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| PostgreSQL | 14+ |

### Setup

```bash
git clone https://github.com/<your-username>/smartpark.git
cd smartpark
```

**Backend**

```bash
cd backend
npm install
```

**Create .env**

```bash
PORT=5000
DATABASE_URL=postgres://<user>:<pass>@localhost:5432/smartpark
JWT_SECRET=<secret>
SESSION_SECRET=<secret>
```

```bash
npm run seed
npm run dev
```

**Frontend**
```bash
cd ../frontend
npm install
npm start
```

## Future Improvements

- Better authentication and authorization security.
- More interactive lot layout management.
- More robust front-end development.
- Optional features implementation.
