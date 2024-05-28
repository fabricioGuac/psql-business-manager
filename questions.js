
const  question = [{type:"list",
name:"action",
choices:['View All Employees || by manager ||by department', 'Add Employee', 'Update Employee (Role | managers | delete)', 'View All Roles', 'Add Role','Delete Role', 'View All Departments','Add Department','Delete Department','department total budget', 'Exit' ],
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