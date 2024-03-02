const express = require('express');

//solve cors issue
const cors = require("cors");

const app = express();

app.use(cors());
const port = 5000;
const Pool = require('pg').Pool;
  //Enter here your Postres database details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: 'mani',
    dialect: 'postgres',
    port: 5432
});
  
  //Database connection and also please create postgres database first
pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})
  
app.get('/customers', (req, res, next) => {
    console.log("TEST DATA :");
    pool.query('Select * from customers')
        .then(testData => {
            console.log(testData);
            res.send(testData.rows);
        })
})

app.listen(port, () => {
  console.log(`Horror jassa app is running on port ${port}.`);
});