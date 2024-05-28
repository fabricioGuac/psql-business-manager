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