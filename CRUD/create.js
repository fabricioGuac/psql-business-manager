const addDepartments = async (dept) => {
    try {
        await pool.query(`INSERT INTO department (name) VALUES ($1)`, [dept]);
        console.log(`Department ${dept} created successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

const addRole = async (title, dept, salary) => {
    try {
        await pool.query(`INSERT INTO role (title, department_id, salary) VALUES ($1, $2, $3)`, [title,dept,salary]);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

const employeeAdder = async (first_name, last_name, manager, role) => {
    try {
        const manSplit = manager.split(' ');
        const managerResponse = await pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,[manSplit[0],manSplit[1]]); 
        const roleResponse = await pool.query(`SELECT id FROM role WHERE title = $1`,[role]); 
        const manager_id =managerResponse.rows[0].id; 
        const role_id = roleResponse.rows[0].id;
        await pool.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4)`, [first_name,last_name,manager_id,role_id]);
        console.log(`User ${first_name} ${last_name} has been added successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}