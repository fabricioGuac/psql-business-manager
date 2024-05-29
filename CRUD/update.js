// Requires the inquirer package and functions from listMaker
const inquirer = require('inquirer');
const {empLister, rolLister} = require('../helper/listMaker');

// Creates a function to update the employee role
const upEmp = async (pool) => {
    try{
    
    // Calls the functions to return the array of object for the questions
    const empList = await empLister(pool);
    const rolList = await rolLister(pool);
    
    // Gets the information to update the employee
    const {emp_id,role_id} = await inquirer.prompt([{
            type:"list",
            name:'emp_id',
            choices:empList,
            message:`Who is the employee to modify?`
        },{
            type:"list",
            name:'role_id',
            choices:rolList,
            message:`What is the new role for the employee?`
        }]);
        // Updates the employee setting the role id to the value of role_id where the employee id equals the emp_id
     await pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,[role_id, emp_id]);
    console.log(`Employee's role modified successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

// Creates a function to update the employee's manager
const upEmpMan = async (pool) => {
    try{   
    // Calls the functions to return the array of object for the questions
    const empList = await empLister(pool);
    
    // Gets the id of the employee to update
    const {emp_id} = await inquirer.prompt([{
            type:"list",
            name:'emp_id',
            choices:empList,
            message:`Who is the employee to modify?`
        }]);

        // Filters the empList to avoid an employee being his own manager and pushes the None option with a value of null
	const manOptions = empList.filter((man) => man.value !== emp_id);
	manOptions.push({name: 'None', value: null});

    // Gets the id of the new manager
	 const{man_id} = await inquirer.prompt([{
            type:"list",
            name:'man_id',
            choices:manOptions,
            message:`Who is the new employee's manager?`
        }]);

        // Updates the employee setting the manager id to the value of man_id where the employee id equals the emp_id
     await pool.query(`UPDATE employee SET manager_id = $1 WHERE id = $2`,[man_id, emp_id]);
    console.log(`Employee's role modified successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

// Exports the functions
module.exports = {upEmp, upEmpMan};