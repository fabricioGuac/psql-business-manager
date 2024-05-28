const inquirer = require('inquirer');


const upEmp = async (pool) => {
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

const upEmpMan = async (pool) => {
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

module.exports = {upEmp, upEmpMan};