const sql = require('mssql');

const config = {
    user: 'Proiect_IP',
    password: 'student123!',
    server: 'safeyserver.database.windows.net', 
    database: 'SafeyDB',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, poolPromise
};