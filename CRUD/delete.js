const delDepartments = async (dept) => {
    try {
        await pool.query(`DELETE FROM department  WHERE name = ($1)`, [dept]);
        console.log(`Department ${dept} deleted successfully`);
    } catch (err) {
        console.error(`An error has occurred ${err}`);
        return;
    }
}

