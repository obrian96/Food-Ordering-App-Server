const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const config = require('config');

const loginRouter = express.Router();

loginRouter.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////////////////
loginRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();     //continue to look for additional specification that will match /dishes
})
.post( async (req,res,next) => {
    user_email = req.body.user_email;
    user_pass = req.body.user_pass;

    console.log("Email: " + user_email + "\nPassword: " + user_pass);

    const [email] = await db.query(`SELECT * FROM users_details WHERE user_email = "${user_email}";`);
    if(email.length == 0){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"Account does not exist!"});
        return;
    }

    user_id = email[0].user_id;
    const [pass] = await db.query(`SELECT * FROM users WHERE user_id = "${user_id}";`);

    // console.log(pass[0].user_pass);

    if (pass[0].user_pass != user_pass){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"Wrong password!"});
    }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(pass[0]);
    }
});

/////////////////////////////////////////////////////////////////////////////////
loginRouter.route('/newuser')
.post(async (req, res, next) => {
    const user = {
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_pass: req.body.user_pass,
        isAdmin: 0 
    }

    const [email] = await db.query(`SELECT * FROM users_details where user_email = "${user.user_email}";`);
    console.log(email.length);
    if(email.length != 0){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/json');
        res.json({"status":"Account already exists"});
    }
    else {
        db.query(`
            INSERT INTO users (
            user_id, user_name, user_pass, isAdmin
            ) VALUES (
            "${user.user_id}", "${user.user_name}", "${user.user_pass}", 0
            );
            `);
        moment = require('moment');
        user_joindt = moment().format("YYYY-MM-DD");
        db.query(`
            INSERT INTO users_details (
            user_id, user_email, user_phno, user_addline, user_pincode, 
            user_joindt
            ) VALUES (
            "${user.user_id}", "${user.user_email}", "", "", 0, 
            "${user_joindt}"
            );
            `);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(user);
    }
})
.delete((req, res, next) => {
    res.end('Will add feature to delete profile later!');
});

async function main(){
    db = await mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      timezone: config.get('db.timezone'),
      charset: config.get('db.charset')
  });  
}
main();

module.exports = loginRouter;