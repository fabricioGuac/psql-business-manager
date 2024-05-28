const delDepartments = async (dept) => {
    try {
        await pool.query(`DELETE FROM department  WHERE name = ($1)`, [dept]);
        console.log(`Department ${dept} deleted successfully`);
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
