// Require the necessary packages and functions
const inquirer = require('inquirer');
const {Pool} = require('pg');
const {read, create, del, update} = require('./CRUD');

// Creates a new instance of pool
const pool = new Pool(
    {
        // Introduce the username and password for your postgres account
        user: 'account',
        password:'superSecurePasswordNoOneWillEverSee',
        host: 'localhost',
        database: 'bussiness_db'
    }
)

// Connects to the database
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
//   Starts prompting the questions
    prompter();
})
.catch((err) => {
    console.error(`An error has occurred while connecting to the database: ${err}`);
    // Exits the node.js process on failure status code
    process.exit(1);
});

// Defines the list of the possible actions that will be prompted
const  question = [{type:"list",
name:"action",
choices:['View All Employees', 'View All Employees by manager','View All Employees by department', 'Add Employee', 'Update Employee Role','Update Employee Manager','Delete Employee', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
message:"What would you like to do?"
}];

// Creates a function to prompt the possible actions
const prompter = async () =>{
    const answer = await inquirer.prompt(question);
    actionTaker(answer.action);
}

// Switch case to handle different actions and call corresponding functions
const actionTaker = async (action) => {
    switch(action){
        case 'View All Employees':
            const employees = await read.employeeGetter(pool);
            console.table(employees);
            break;
        case 'View All Employees by manager':
            const empsByMan = await read.empsByManGetter(pool);
            console.table(empsByMan);
            break;
        case 'View All Employees by department':
            const empsByDept = await read.empsByDeptGetter(pool);
            console.table(empsByDept);
            break;
        case 'Add Employee':
            await create.addEmp(pool);
            break;
        case 'Update Employee Role':
            await update.upEmp(pool);
            break;
        case 'Update Employee Manager':
            await update.upEmpMan(pool);
            break;
        case 'Delete Employee':
            await del.delEmp(pool)
            break;
        case 'View All Roles':
            const roles = await read.roleGetter(pool);
            console.table(roles);
            break;
        case 'Add Role':
            await create.addRol(pool);
            break;
        case 'Delete Role':
            await del.delRol(pool);
            break;
        case 'View All Departments':
            const departments = await read.departmentGetter(pool);
            console.table(departments);
            break;
        case 'Add Department':
            await create.addDept(pool);
            break;
        case 'department total budget':
            const budget = await read.totalBudged(pool);
            console.table(budget);
            break;
        case 'Delete Department':
            await del.delDep(pool);
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
            // Exits the node.js process on success status code
            process.exit(0);
    }
// Calls the prompter function to mantain a loop
   prompter();
}