const inquirer = require('inquirer');
const {Pool} = require('pg');

const pool = new Pool(
    {
        user: 'account',
        password:'',
        host: 'localhost',
        database: ''
    }
)

pool.connect()
.then(() => {
    console.log('Connected to the company database.');
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
        const employees = await pool.query('SELECT * FROM employee');
        return employees.rows;
    }catch(err) {
        console.error(`An error has occured in the query ${err}`);
        return [];
    }
}

const roleGetter = async () => {
    try{
        const roles = await pool.query('SELECT * FROM role');
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
            console.log('10 BYE BYE');
            process.exit(0);
    }
    prompter();

}