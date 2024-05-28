const inquirer = require('inquirer');


const addDept = async (pool) => {
    try{
    const {newDept} = await inquirer.prompt([{
        type:'input',
        name:'newDept',
        message:'What is the name of the new department?'
    }]);
    await pool.query(`INSERT INTO department (name) VALUES ($1)`,[newDept]);
    console.log('Department created successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

const addRol = async (pool) => {
    try{
    const department = await pool.query(`SELECT name, id FROM department`);
    
    const deptInfo = department.rows.map((dept) => ({name: dept.name, value:dept.id}));
    
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
    await pool.query(`INSERT INTO role (title, department_id, salary) VALUES ($1, $2, $3)`,[newRol, deptId, newSal]);
    console.log('Role created successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}


const addEmp = async (pool) => {
    try{
    const mangr = await pool.query(`SELECT first_name,last_name, id FROM employee`);

    const mangrList = mangr.rows.map((row) => ({name: `${row.first_name} ${row.last_name}`, value:row.id}));
    
    mangrList.push({name: 'None', value: null});
    
    const role = await pool.query(`SELECT title, id FROM role`);
    
    const rolList = role.rows.map((role) => ({ name: role.title, value: role.id }));
    
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
    await pool.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4)`, [first_name,last_name,manager_id,role_id]);
    console.log('Employee added successfully');
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
    }

module.exports = {addDept, addRol, addEmp};