const inquirer = require('inquirer');
const  questions = [{type:"list",
name:"action",
choices:['View All Employees || by manager ||by department ', 'Add Employee', 'Update Employee (Role | managers | delete)', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
message:"What shape would you like to do?"
}];


inquirer.prompt(questions)
        .then((answer) => console.log(answer));