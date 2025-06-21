# Battery Management API

This project provides a robust RESTful API for managing battery sensor data, including recording data points and retrieving historical information for individual batteries or specific metrics within defined timeframes. It's built with Node.js, Express, and PostgreSQL, designed for scalability and ease of use in IoT and monitoring applications.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Database Setup](#database-setup)
    -   [Environment Variables](#environment-variables)
    -   [Running the Application](#running-the-application)
-   [API Endpoints](#api-endpoints)
    -   [Authentication (Optional/Future)](#authentication-optionalfuture)
    -   [Battery Data Endpoints](#battery-data-endpoints)
-   [Usage and Testing](#usage-and-testing)
-   [Project Structure](#project-structure)
-   [Future Enhancements](#future-enhancements)
-   [License](#license)

## Features

* **Battery Data Ingestion:** Securely record battery sensor data (battery ID, current, voltage, temperature, timestamp).
* **Comprehensive Data Retrieval:**
    * Fetch all recorded battery data.
    * Retrieve all data points for a specific battery.
    * Retrieve data points for a specific battery within a defined time range.
    * Retrieve a single metric (current, voltage, or temperature) for a specific battery.
    * Retrieve a single metric for a specific battery within a defined time range.
* **Robust Error Handling:** Provides clear error messages for invalid requests and server issues.
* **Logging:** Integrates a Winston-based logger for structured application logging.
* **Configuration Management:** Uses `node-config` for environment-specific settings.
* **Database Integration:** Utilizes PostgreSQL as the data store with `pg-pool` for efficient connection management.
* **Data Validation (Planned/Re-enable):** `express-validator` for robust input validation.
* **Authentication (Planned/Re-enable):** JWT-based authentication for securing sensitive data retrieval endpoints.

## Technologies Used

* **Node.js**: JavaScript runtime environment
* **Express.js**: Web application framework for Node.js
* **PostgreSQL**: Relational database
* **`pg` & `pg-pool`**: PostgreSQL client for Node.js
* **`config`**: Universal configuration for Node.js projects
* **`dotenv`**: Loads environment variables from a `.env` file
* **`moment`**: JavaScript date library for parsing, validating, manipulating, and formatting dates
* **`winston`**: Versatile logging library
* **`express-validator`**: Middleware for validation (to be re-enabled)
* **`bcryptjs`**: For password hashing (for authentication, to be implemented)
* **`jsonwebtoken`**: For generating and verifying JWTs (for authentication, to be implemented)
* **`cors`**: Middleware for enabling Cross-Origin Resource Sharing

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager)
* PostgreSQL database server
* pgAdmin 4 (or any PostgreSQL client)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/Battery-Management-API.git](https://github.com/your-username/Battery-Management-API.git)
    cd Battery-Management-API
    ```
    (Replace `your-username/Battery-Management-API.git` with your actual repository URL if you've put it on GitHub).

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Database Setup

1.  **Create a PostgreSQL Database:**
    Open `pgAdmin 4` (or your PostgreSQL client) and create a new database. Let's call it `battery_db`.

2.  **Create a Database User (Optional but Recommended for Security):**
    Create a new user (e.g., `battery_user`) with a strong password and grant it permissions to connect to `battery_db`.
    ```sql
    CREATE USER battery_user WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE battery_db TO battery_user;
    ```

3.  **Create Tables:**
    Connect to `battery_db` with `battery_user` (or `postgres` for convenience during setup) and execute the following SQL to create the `battery_data` table:

    ```sql
    CREATE TABLE battery_data (
        id SERIAL PRIMARY KEY,
        battery_id VARCHAR(50) NOT NULL,
        current DECIMAL(10, 2) NOT NULL,
        voltage DECIMAL(10, 2) NOT NULL,
        temperature DECIMAL(10, 2) NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- If you plan to implement user authentication later
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    ```

4.  **Grant Permissions on `battery_data` Table (Crucial!):**
    If the table owner is `postgres` (which is often the default), you **must** grant permissions to `battery_user`.
    In pgAdmin, right-click on the `battery_data` table -> Properties -> General tab -> Change **Owner** to `battery_user`. Then save.
    Alternatively, using SQL:
    ```sql
    ALTER TABLE battery_data OWNER TO battery_user;
    GRANT ALL PRIVILEGES ON TABLE battery_data TO battery_user;
    -- Also grant USAGE on the sequence for the 'id' SERIAL column
    GRANT USAGE, SELECT ON SEQUENCE battery_data_id_seq TO battery_user;
    ```
    Repeat for `users` table if you create it:
    ```sql
    ALTER TABLE users OWNER TO battery_user;
    GRANT ALL PRIVILEGES ON TABLE users TO battery_user;
    GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO battery_user;
    ```

### Environment Variables

Create a `.env` file in the root directory of your project. This file will store your sensitive database credentials and other configuration settings.
