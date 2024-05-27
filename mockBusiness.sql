CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);  

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);


CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT
);  

    -- FOREIGN KEY (manager_id)
    -- REFERENCES employees(id)
    -- ON DELETE SET NULL,
    -- FOREIGN KEY (role_id)
    -- REFERENCES roles(id)
    -- ON DELETE SET NULL
    
    
INSERT INTO department(name)
VALUES('Accounting'),
('customer service'),
('Kitchen');


INSERT INTO role(title,department_id, salary)
VALUES('Accountant', 1, 56000),
('Receivable Clerk', 1, 60000),
('Auditor', 1, 45000),
('Chef', 3, 100000),
('Sous Chef', 3, 93000),
('Line cook', 3, 64000),
('Sales Associate',2, 110000),
('Front Desk Receptionist', 2, 40000),
('Call Center agent', 2,30000);


INSERT INTO employee(name, last_name, manager_id,role_id)
VALUES
('Juan','Lereico',null,1),
('Oriana','Vidal',1,7),
('Jose','Becerra',1,4),
('Misael','Puerta',1,2),
('Pedro','Rodriguez',1,3),
('Miguel','Vasquez',1,5),
('Maria','Suarez',1,6),
('Euclides','Monroe',1,8),
('Jesus','Salazar',1,9);

