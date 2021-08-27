require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const app = express();
const PORT = 4000;
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const authCtrl = require('./controllers/authController');

app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db);
    console.log(`DB connection established!`);
    db.seed();
}).catch(err => {
    console.log(`Error connecting to DB: ${err}`);
});

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } //30 days
}))

app.post('/auth/register', authCtrl.register);


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));