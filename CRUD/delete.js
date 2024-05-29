// Requires the inquirer package and the function from listMaker
const inquirer = require('inquirer');
const {depLister,rolLister,empLister} = require('../helper/listMaker');


// Creates a fumction to delete a department
const delDep = async (pool) => {
    try{

        // Calls the functions to return the array of object for the questions
        const deptInfo = await depLister(pool);

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

        // Calls the functions to return the array of object for the questions
        const rolInfo = await rolLister(pool);

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

    // Calls the functions to return the array of object for the questions
    const empInfo = await empLister(pool);
    
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
