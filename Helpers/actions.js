const {employeeGetter, roleGetter, departmentGetter} = require('./CRUD/read');

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

module.exports = actionTaker;