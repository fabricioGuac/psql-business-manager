// Requires the inquirer package
const inquirer = require('inquirer');

// Creates a fumction to delete a department
const delDep = async (pool) => {
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
        message: `Wich department would you like to delete?`
    }]);

    // Deletes from the department table the department with the id of the target department
    await pool.query(`DELETE FROM department WHERE id = $1`, [deptId]);
    console.log(`Department deleted successfylly`);
}catch (err){
    console.error(`Error deleting department ${err}`);
}
}

const delRol = async (pool) => {
    try {

        // Gets the titles and ids of the roles
    const role = await pool.query(`SELECT title, id FROM role`);
    
    // Uses map to create an array of objects with the title of the roles and the value of their ids to prompt as the choices for the role_id
    const rolInfo = role.rows.map((role) => ({ name: role.title, value: role.id }));

    // Gets the rol id using inquirer
    const { rolId } = await inquirer.prompt([{
        type: 'list',
        name: 'rolId',
        choices: rolInfo,
        message: 'Select the role to delete'
    }]);
    // Delets the role from the role table matching the target role id
    await pool.query(`DELETE FROM role WHERE id = $1`, [rolId]);
    console.log(`Role deleted successfully`)
    } catch (err) {
        console.error(`Error deleting role ${err}`);
    }
}


const delEmp = async (pool) => {
    try {

        // Gets the names and ids of the employees
    const employee = await pool.query(`SELECT id, first_name, last_name FROM employee`);
    
    // Uses map to create an array of objects with the full name of the employees and the value of their ids to prompt as the choices for the empId
    const empInfo = employee.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));
    
    // Gets the employee id using inquirer
    const {empId} = await inquirer.prompt([{
        type:'list',
        name:"empId",
        choices:empInfo,
        message:`wich employee would you like to delete?`
    }]);
    
    // Deletes the employee from the employee table matching the employee id
    await pool.query(`DELETE FROM employee WHERE id = $1`,[empId]);
    
    console.log(`Employee deleted successfully`);
    } catch (err) {
        console.error(`Error deleting employee ${err}`);
    }
}

module.exports = {delDep, delRol, delEmp};
