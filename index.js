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
choices:['View All Employees || by manager ||by department', 'Add Employee', 'Update Employee (Role | managers)','Delete Employee', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
message:"What would you like to do?"
}];

const newDept = [{
    type:"input",
    name:"dept",
    message:"What is the name of the new department?"
}];

const delDept = [{
    type:"input",
    name:"dept",
    message:"What is the name of the department to delete?"
}];

const roleOptions = async () => {
    const response = await pool.query('SELECT name FROM department');
    const rows = response.rows;
    const depts = rows.map((row) => row.name);
    const question = [{
        type:"input",
        name:"title",
        message:"What is the title of the new role"
    },{
        type:"input",
        name:"salary",
        message:"What is the salary of this role"
    },{
        type:"list",
        name:"dept",
        choices:depts,
        message:"Wich department does this role belong to?"
    }];
    console.log(question);
    return question;
}

const delRoleQuest = [{
    type:"input",
    name:"role",
    message:"What is the title of the role to delete?"
}];

const newEmpInfo = async () => {
    const resNam = await pool.query('SELECT first_name, last_name FROM employee');
    const rowNam = resNam.rows;
    const posbMg = rowNam.map((row) => `${row.first_name} ${row.last_name}`);
    const resRol = await pool.query('SELECT title FROM role');
    const rowRol = resRol.rows;
    const posbRol = rowRol.map((row) => row.title);
    posbMg.push('None');
    const question =[{
        type:'input',
        name:'first',
        message:`What is the new employee's first name?`
    },{
        type:'input',
        name:'last',
        message:`What is the new employee's last name?`
    },{
        type:"list",
        name:'role',
        choices:posbRol,
        message:`What is the employee's role?`
    },{
        type:"list",
        name:'manager',
        choices:posbMg,
        message:`Who is the employee's manager?`
    }];
    return question;
}

const EmpUp = async () =>{
    const resNam = await pool.query('SELECT first_name, last_name FROM employee');
    const rowNam = resNam.rows;
    const posbMg = rowNam.map((row) => `${row.first_name} ${row.last_name}`);
    const resRol = await pool.query('SELECT title FROM role');
    const rowRol = resRol.rows;
    const posbRol = rowRol.map((row) => row.title);
    posbMg.push('None');
    const question =[{
        type:"list",
        name:'employee',
        choices:posbMg,
        message:`Which employee's role do you want to update?`
    },{
        type:"list",
        name:'role',
        choices:posbRol,
        message:`What is the new employee's role?`
    }];
    return question;
}

const delEmp = async () => {
const employee = await pool.query(`SELECT id, first_name, last_name FROM employee`);

const empInfo = employee.rows.map((emp) => ({name: `${emp.first_name} ${emp.last_name}`, value:emp.id}));

const {empId} = await inquirer.prompt([{
    type:'list',
    name:"empId",
    choices:empInfo,
}]);
await pool.query(`DELETE FROM employee WHERE id = $1`,[empId]);

console.log(`Employee deleted successfully`);
}


const prompter = async () =>{
    const answer = await inquirer.prompt(question);
    actionTaker(answer.action);
}

const newDeptHandler = async () => {
    const deptName = await inquirer.prompt(newDept);
    await addDepartments(deptName.dept);
}

const delDeptHandler = async () => {
    const targetDept = await inquirer.prompt(delDept);
    await delDepartments(targetDept.dept);
}

const newRoleHandler = async () => {
    const {title, dept, salary} = await inquirer.prompt( await roleOptions());
    const deptRows = await pool.query('SELECT id FROM department WHERE name = $1', [dept]);
    const deptId = deptRows.rows[0].id;
    await addRole(title, deptId, salary);
}

const delRoleHandler = async () => {
    const targetRole = await inquirer.prompt(delRoleQuest);
    await delRole(targetRole.role);
}

const employeeAdderHandler = async () => {
    const {first, last, manager, role} = await inquirer.prompt(await newEmpInfo());
    let manager_id = null;
    if(manager !== 'None'){
        const manSplit = manager.split(' ');
        const managerResponse = await pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,[manSplit[0],manSplit[1]]);
        manager_id = managerResponse.rows[0].id;
        }
    const roleResponse = await pool.query(`SELECT id FROM role WHERE title = $1`,[role]); 
    const role_id = roleResponse.rows[0].id;
    await employeeAdder(first,last,manager_id, role_id);
}

const employeeUpdateHandler = async () => {
    const {employee, role} = await inquirer.prompt(await EmpUp());
    let emp_id = null;
        const empSplit = employee.split(' ');
        const empResponse = await pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,[empSplit[0],empSplit[1]]);
        emp_id = empResponse.rows[0].id;
    const roleResponse = await pool.query(`SELECT id FROM role WHERE title = $1`,[role]); 
    const role_id = roleResponse.rows[0].id;
    await emplUpdater(emp_id, role_id);
}

const employeeGetter = async () => {
    try{
        const employees = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager
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

const addDepartments = async (dept) => {
    try {
        await pool.query(`INSERT INTO department (name) VALUES ($1)`, [dept]);
        console.log(`Department ${dept} created successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

const delDepartments = async (dept) => {
    try {
        await pool.query(`DELETE FROM department  WHERE name = ($1)`, [dept]);
        console.log(`Department ${dept} deleted successfully`);
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

const delRole = async (role) => {
    try {
        await pool.query(`DELETE FROM role  WHERE title = ($1)`, [role]);
        console.log(`Role ${role} deleted successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

const employeeAdder = async (first_name, last_name, manager, role) => {
    try {
        await pool.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4)`, [first_name,last_name,manager,role]);
        console.log(`User ${first_name} ${last_name} has been added successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

// empDel here

const emplUpdater = async (emp_id, role_id) => {
    try {
        await pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,[role_id, emp_id]);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

const actionTaker = async (action) => {
    switch(action){
        case 'View All Employees || by manager ||by department':
            const employees = await employeeGetter();
            console.table(employees);
            break;
        case 'Add Employee':
            await employeeAdderHandler();
            console.log('2');
            break;
        case 'Update Employee (Role | managers | delete)':
            await employeeUpdateHandler();
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
            await newRoleHandler();
            break;
        case 'Delete Role':
            console.log('6');
            await delRoleHandler();
            break;
        case 'View All Departments':
            const departments = await departmentGetter();
            console.table(departments);
            break;
        case 'Add Department':
            await newDeptHandler();
            break;
        case 'department total budget':
            console.log('9');
            break;
        case 'Delete Department':
            await delDeptHandler();
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