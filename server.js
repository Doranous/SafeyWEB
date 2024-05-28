const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const app = express();
const { poolPromise } = require('./db');

app.use(cors()); // Utilizează middleware-ul cors
app.use(express.json()); // Middleware pentru a parsa JSON

app.get('/api/users', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM dbo.Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: `${err}` });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(username, password); // Păstrează linia pentru debugging

        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM dbo.Users WHERE Username = @username AND Password = @password');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({ userId: user.UserID, userType: user.UserType });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

app.get('/api/patient/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Pacienti WHERE UserID = @id');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (err) {
        console.error('Error fetching patient info: ', err);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
