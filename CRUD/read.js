const pool = require('../Helpers/pool')


const employeeGetter = async () => {
    try{
        const employees = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, m.first_name as manager
        FROM employee e
        JOIN role r ON r.id = e.role_id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id;`);
        return employees.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

const roleGetter = async () => {
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

const  departmentGetter = async () => {
    try{
        const departments = await pool.query('SELECT * FROM department');
        return departments.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

module.exports = {employeeGetter, roleGetter, departmentGetter};