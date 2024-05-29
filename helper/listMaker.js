const empLister = async(pool) => {
// Gets the names and ids of the employees
const emp = await pool.query(`SELECT first_name,last_name, id FROM employee`);

// Uses map to create an array of objects with the full name of the employees and the value of their ids to prompt as the choices for the emp_id
const empList = emp.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));
    return empList;
};

const rolLister = async (pool) => {
    // Gets the titles and ids of the roles

    const role = await pool.query(`SELECT title, id FROM role`);

    // Uses map to create an array of objects with the title of the roles and the value of their ids to prompt as the choices for the role_id
    const rolList = role.rows.map((role) => ({ name: role.title, value: role.id }));
    return rolList;
}

const depLister = async (pool) => {
    // Gets the names and ids of the departments
    const department = await pool.query(`SELECT name, id FROM department`);

    // Uses map to create an array of objects with the name of the departments and the value of the id to prompt as the choices for the deptId
    const deptInfo = department.rows.map((dept) => ({name: dept.name, value:dept.id}));
    return deptInfo;
}

module.exports = {empLister, rolLister, depLister};