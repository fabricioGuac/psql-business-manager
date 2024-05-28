const inquirer = require('inquirer');
const {Pool} = require('pg');

const pool = new Pool(
    {
        user: 'account',
        password:'superSecurePasswordNoOneWillEverSee',
        host: 'localhost',
        database: 'negocio_db'
    }
)

pool.connect()
.then(() => {
    console.log(`
    ____                _                          
   |  _ \\              (_)                         
   | |_) |_   _ ___ ___ _ _ __   ___ ___ ___       
   |  _ <| | | / __/ __| | '_ \\ / _ \\ __/ __|      
   | |_) | |_| \\__ \\__ \\ | | | |  __/\\__ \\__ \\      
   |____/ \\__,_|___/___|_|_| |_|\\___|___|___/      
   |  \\/  |                                        
   | \\  / | __ _ _ __   __ _  __ _  __ _  ___ _ __ 
   | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _\` |/ _ \\ '__|
   | |  | | (_| | | | | (_| | (_| | (_| |  __| |   
   |_|  |_|\\__,_|_| |_|\\__,_|\\__,_|\\__, |\\___|_|   
                              __/ | __/ |          
                             |___/ |___/           
  `);
    prompter();
})
.catch((err) => {
    console.error(`An error has occurred while connecting to the database: ${err}`);
    process.exit(1);
});

const  question = [{type:"list",
name:"action",
choices:['View All Employees', 'View All Employees by manager','View All Employees by department', 'Add Employee', 'Update Employee Role','Update Employee Manager','Delete Employee', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
message:"What would you like to do?"
}];




const prompter = async () =>{
    const answer = await inquirer.prompt(question);
    actionTaker(answer.action);
}



const employeeGetter = async () => {
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
const empsByDeptGetter = async () => {
    try{
        const depts = await pool.query(`SELECT * FROM department`);

    const deptInfo = depts.rows.map((dept) => ({ name: dept.name, value: dept.id }));
    const { deptId } = await inquirer.prompt([{
        type: 'list',
        name: 'deptId',
        choices: deptInfo,
        message: `Wich department's employees would you like to see?`
    }]);
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

const empsByManGetter = async () => {
    try{
        const mangr = await pool.query(`SELECT DISTINCT e.id, e.first_name, e.last_name
        FROM employee e
        JOIN employee m ON e.id = m.manager_id;`);

        const mangrList = mangr.rows.map((row) => ({name: `${row.first_name} ${row.last_name}`, value:row.id}));
    
        mangrList.push({name: 'None', value: null});
    const { manId } = await inquirer.prompt([{
        type: 'list',
        name: 'manId',
        choices: mangrList,
        message: `Wich manager's employees would you like to see?`
    }]);
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

// Create section
const addDept = async () => {
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

const addRol = async () => {
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


const addEmp = async () => {
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



// Deleting section
const delDep = async () => {
    try{
    const depts = await pool.query(`SELECT * FROM department`);

    const deptInfo = depts.rows.map((dept) => ({ name: dept.name, value: dept.id }));
    const { deptId } = await inquirer.prompt([{
        type: 'list',
        name: 'deptId',
        choices: deptInfo,
        message: `Wich department would you like to delete?`
    }]);

    await pool.query(`DELETE FROM department WHERE id = $1`, [deptId]);
    console.log(`Department deleted successfylly`);
}catch (err){
    console.error(`Error deleting department ${err}`);
}
}

const delRol = async () => {
    try {
    const role = await pool.query(`SELECT title, id FROM role`);
    const rolInfo = role.rows.map((role) => ({ name: role.title, value: role.id }));
    const { rolId } = await inquirer.prompt([{
        type: 'list',
        name: 'rolId',
        choices: rolInfo,
        message: 'Select the role to delete'
    }]);
    await pool.query(`DELETE FROM role WHERE id = $1`, [rolId]);
    console.log(`Role deleted successfully`)
    } catch (err) {
        console.error(`Error deleting role ${err}`);
    }
}


const delEmp = async () => {
    try {
    const employee = await pool.query(`SELECT id, first_name, last_name FROM employee`);
    
    const empInfo = employee.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));
    
    const {empId} = await inquirer.prompt([{
        type:'list',
        name:"empId",
        choices:empInfo,
        message:`wich employee would you like to delete?`
    }]);
    await pool.query(`DELETE FROM employee WHERE id = $1`,[empId]);
    
    console.log(`Employee deleted successfully`);
    } catch (err) {
        console.error(`Error deleting employee ${err}`);
    }

}

// Update section

const upEmp = async () => {
    try{
    const emp = await pool.query(`SELECT first_name,last_name, id FROM employee`);
    
    const empList = emp.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));
    
    const role = await pool.query(`SELECT title, id FROM role`);
    
    const rolList = role.rows.map((role) => ({ name: role.title, value: role.id }));
    
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
     await pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,[role_id, emp_id]);
    console.log(`Employee's role modified successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}

const upEmpMan = async () => {
    try{
    const emp = await pool.query(`SELECT first_name,last_name, id FROM employee`);
    
    const empList = emp.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));
    	

    const {emp_id} = await inquirer.prompt([{
            type:"list",
            name:'emp_id',
            choices:empList,
            message:`Who is the employee to modify?`
        }]);

	const manOptions = empList.filter((man) => man.value !== emp_id);
	manOptions.push({name: 'None', value: null});
	 const{man_id} = await inquirer.prompt([{
            type:"list",
            name:'man_id',
            choices:manOptions,
            message:`Who is the new employee's manager?`
        }]);
     await pool.query(`UPDATE employee SET manager_id = $1 WHERE id = $2`,[man_id, emp_id]);
    console.log(`Employee's role modified successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
    }
}


const actionTaker = async (action) => {
    switch(action){
        case 'View All Employees':
            const employees = await employeeGetter();
            console.table(employees);
            break;
        case 'View All Employees by manager':
            const empsByMan = await (empsByManGetter());
            console.table(empsByMan);
            break;
        case 'View All Employees by department':
            const empsByDept = await (empsByDeptGetter());
            console.table(empsByDept);
            break;
        case 'Add Employee':
            await addEmp();
            console.log('2');
            break;
        case 'Update Employee Role':
            await upEmp();
            console.log('3');
            break;
        case 'Update Employee Manager':
            await upEmpMan();
            console.log('3');
            break;
        case 'Delete Employee':
            await delEmp()
            console.log('3.5');
            break;
        case 'View All Roles':
            const roles = await roleGetter();
            console.table(roles);
            break;
        case 'Add Role':
            console.log('5');
            await addRol();
            break;
        case 'Delete Role':
            console.log('6');
            await delRol();
            break;
        case 'View All Departments':
            const departments = await departmentGetter();
            console.table(departments);
            break;
        case 'Add Department':
            await addDept();
            break;
        case 'department total budget':
            console.log('9');
            break;
        case 'Delete Department':
            await delDep();
            break;
        case 'Exit':
            console.log(`
            ______      _ _   _             
           |  ____|    (_) | (_)            
           | |__  __  ___| |_ _ _ __   __ _ 
           |  __| \\ \\/ / | __| | '_ \\ / _\` |
           | |____ >  <| | |_| | | | | (_| |
           |______/_/\\_\\_|\\__|_|_| |_|\\__, |
                                       __/ |
                                      |___/
          `
            );
            process.exit(0);
    }
   prompter();
}