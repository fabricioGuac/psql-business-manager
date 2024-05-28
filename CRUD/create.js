// Requires the inquirer package
const inquirer = require('inquirer');

// Creates a function to add a new department
const addDept = async (pool) => {

    try{
        // Gets the name of the new department using inquirer
    const {newDept} = await inquirer.prompt([{
        type:'input',
        name:'newDept',
        message:'What is the name of the new department?'
    }]);

    // Inserts the new department into the department table
    await pool.query(`INSERT INTO department (name) VALUES ($1)`,[newDept]);
    console.log('Department created successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

// Creates a function to add a new role
const addRol = async (pool) => {

    try{
        // Gets the names and ids of the departments
    const department = await pool.query(`SELECT name, id FROM department`);

    // Uses map to create an array of objects with the name of the departments and the value of the id to prompt as the choices for the deptId
    const deptInfo = department.rows.map((dept) => ({name: dept.name, value:dept.id}));

    // Gets the information of the role using inquirer
    const {newRol, deptId, newSal} = await inquirer.prompt([{
        type:'input',
        name:'newRol',
        message:'What is the name of the new role?'
    },{
        type:'input',
        name:'newSal',
        message:'What is the salary of the new role?'
    },{
        type:'list',
        name:"deptId",
        choices:deptInfo,
        message:'Wich department does it belong to?'
    }]);

    // Inserts the new role into the role table
    await pool.query(`INSERT INTO role (title, department_id, salary) VALUES ($1, $2, $3)`,[newRol, deptId, newSal]);
    console.log('Role created successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

// Creates a function to add a new employee
const addEmp = async (pool) => {
    try{

        // Gets the names and ids of the employees
    const mangr = await pool.query(`SELECT first_name,last_name, id FROM employee`);

    // Uses map to create an array of objects with the full name of the employees and the value of their ids to prompt as the choices for the manager_id
    const mangrList = mangr.rows.map((row) => ({name: `${row.first_name} ${row.last_name}`, value:row.id}));

    // pushes None with the value of null for when employees have no manager
    mangrList.push({name: 'None', value: null});

        // Gets the titles and ids of the roles
    const role = await pool.query(`SELECT title, id FROM role`);

    // Uses map to create an array of objects with the title of the roles and the value of their ids to prompt as the choices for the role_id
    const rolList = role.rows.map((role) => ({ name: role.title, value: role.id }));

    // Gets the information for the new employee
    const {first_name,last_name,manager_id,role_id} = await inquirer.prompt([{
            type:'input',
            name:'first_name',
            message:`What is the new employee's first name?`
        },{
            type:'input',
            name:'last_name',
            message:`What is the new employee's last name?`
        },{
            type:"list",
            name:'role_id',
            choices:rolList,
            message:`What is the employee's role?`
        },{
            type:"list",
            name:'manager_id',
            choices:mangrList,
            message:`Who is the employee's manager?`
        }]);
        
        // Inserts the new employee into the employee table
    await pool.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4)`, [first_name,last_name,manager_id,role_id]);
    console.log('Employee added successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
    }

    // Exports the functions
module.exports = {addDept, addRol, addEmp};