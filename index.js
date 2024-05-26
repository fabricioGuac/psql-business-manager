const {Pool} = require('pg');

const pool = new Pool(
    {
        user: '',
        password:'',
        host: 'localhost',
        database: 'company_db'
    }
)

pool.connect()
    .then(() => console.log('Connected to the company database.'))
    .catch((err) => console.error(`An error has occurred ${err}`));


