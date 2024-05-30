-- Eliminates the bussiness_db database if it exists and the creates it
DROP DATABASE IF EXISTS bussiness_db;
CREATE DATABASE bussiness_db;

-- Connects to the bussiness_db
\c bussiness_db;

-- Creates the tables for the database
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);  

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);


CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE
);  

-- Adds manager_id as a foreign key after the table is created to ensure the referenced table exists
ALTER TABLE employee 
ADD FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL;
