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
choices:['View All Employees || by manager ||by department', 'Add Employee', 'Update Employee (Role | managers | delete)', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
message:"What would you like to do?"
}];


const prompter = async () =>{
    const answer = await inquirer.prompt(question);
    actionTaker(answer.action);
}

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

const actionTaker = async (action) => {
    switch(action){
        case 'View All Employees || by manager ||by department':
            const employees = await employeeGetter();
            console.table(employees);
            break;
        case 'Add Employee':
            console.log('2');
            break;
        case 'Update Employee (Role | managers | delete)':
            console.log('3');
            break;
        case 'View All Roles':
            const roles = await roleGetter();
            console.table(roles);
            break;
        case 'Add Role':
            console.log('5');
            break;
        case 'Delete Role':
            console.log('6');
            break;
        case 'View All Departments':
            const departments = await departmentGetter();
            console.table(departments);
            break;
        case 'Add Department':
            console.log('8');
            break;
        case 'department total budget':
            console.log('9');
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