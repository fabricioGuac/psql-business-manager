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