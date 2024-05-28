// Requires the inquirer package
const inquirer = require('inquirer');


// Creates a function to get a join table with the employee's information leveraging left joins to ensure the employee is added even if the role or id are not matched
const employeeGetter = async (pool) => {
    try{
        const employees = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON r.id = e.role_id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id;`);
        return employees.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

// Creates a function to get a join table with the employee's information based on the employee's department
const empsByDeptGetter = async (pool) => {
    try{
        // Selects all the information from the department table
        const depts = await pool.query(`SELECT * FROM department`);

    // Uses map to create an array of objects with the name of the departments and the value of the id to prompt as the choices for the deptId
    const deptInfo = depts.rows.map((dept) => ({ name: dept.name, value: dept.id }));

    // Gets the id of the target department
    const { deptId } = await inquirer.prompt([{
        type: 'list',
        name: 'deptId',
        choices: deptInfo,
        message: `Wich department's employees would you like to see?`
    }]);

    // Selets the information from a join table where the department id matches the target department id
	const employees = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
        FROM employee e
        JOIN role r ON r.id = e.role_id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
	WHERE d.id = $1;`,[deptId]);
    return employees.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

// Creates a function to get a join table with the employee's information based on the employee's manager
const empsByManGetter = async (pool) => {
    try{
        // Gets all the employees ids that appear in the manger id column
        const mangr = await pool.query(`SELECT DISTINCT e.id, e.first_name, e.last_name
        FROM employee e
        JOIN employee m ON e.id = m.manager_id;`);

    // Uses map to create an array of objects with the full name of the managers and the value of their ids to prompt as the choices for the manager_id
        const mangrList = mangr.rows.map((row) => ({name: `${row.first_name} ${row.last_name}`, value:row.id}));
    
    // pushes None with the value of null for when employees have no manager
        mangrList.push({name: 'None', value: null});

        // Gets the id of the manager uding inquirer
    const { manId } = await inquirer.prompt([{
        type: 'list',
        name: 'manId',
        choices: mangrList,
        message: `Wich manager's employees would you like to see?`
    }]);

    // Selets the information from a join table where the manager id matches the target manger id
	const employees = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON r.id = e.role_id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    WHERE (m.id = $1) OR (m.id IS NULL AND $1 IS NULL);`,[manId]);
    return employees.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

// Creates a function to get a join table of the role's information
const roleGetter = async (pool) => {
    try{
        const roles = await pool.query(`SELECT r.id, r.title,d.name as department ,r.salary
        FROM role r
        LEFT JOIN department d ON d.id = r.department_id; `);
        return roles.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

// Creates a function to get a join table of the department's information
const  departmentGetter = async (pool) => {
    try{
        const departments = await pool.query('SELECT * FROM department');
        return departments.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

// Creates a funtion to view the budged dedicated to salaries from eac department
const totalBudged = async (pool) => {
    try {
        const budget = await pool.query(`SELECT d.name, COUNT(e.id) AS employee_count, SUM(r.salary) AS total_budget
        FROM employee e
        JOIN role r ON r.id = e.role_id
        JOIN department d ON r.department_id = d.id
        GROUP BY d.name;`);
        return budget.rows;
    } catch (err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

module.exports = {employeeGetter, empsByDeptGetter, empsByManGetter, roleGetter, departmentGetter, totalBudged};