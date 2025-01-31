const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const config = require('config');

const userdetailsRouter = express.Router();

userdetailsRouter.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////////////////
userdetailsRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
    next();     //continue to look for additional specification that will match /dishes
  })
.post( async (req,res,next) => {
  user_id = req.body.user_id;

  const [uname] = await db.query(`SELECT * FROM users_details, users where users.user_id = users_details.user_id having users.user_id = "${user_id}";`);

  if(uname.length == 0){
    console.log("Please login again.");
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/json');
    res.json({"status": "Please login again."});
  }
  else {
    console.log(JSON.stringify(uname[0], null, 4));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json(uname[0]);
  }
})
.put(async(req,res,next) => {
  try {
    const user = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      user_image: req.body.user_image,
      user_email: req.body.user_email,
      user_pass: req.body.user_pass,
      user_phno: req.body.user_phno,
      user_addline: req.body.user_addline,
    }
    // console.log(user.user_addline, user.user_pincode);
    let sql1 = `UPDATE users_details SET user_email = "${user.user_email}", 
    user_phno = "${user.user_phno}", user_addline = "${user.user_addline}" 
    WHERE user_id = "${user.user_id}";`;

    let sql2 = `UPDATE users SET user_name = "${user.user_name}", 
    user_pass = "${user.user_pass}", user_image = "${user.user_image}" 
    WHERE user_id = "${user.user_id}";`;

    const [result1] = await db.query(sql1);
    const [result2] = await db.query(sql2);
    console.log(result1.affectedRows, result2.affectedRows);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json({"message": "Profile updated!"});
  } catch (e) {
    console.log(e);
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/plain');
    res.json({status:"false"});
  }
});

/////////////////////////////////////////////////////////////////////////////////
userdetailsRouter.route('/newuser')
.post(async (req, res, next) => {
  const user = {user_id: req.body.user_id,
    user_email: req.body.user_email,
    user_phno: req.body.user_phno,
    user_addline: req.body.user_addline,
    user_pincode: req.body.user_pincode,
    user_joindt: req.body.user_joindt,
  }

  const [uid] = await db.query(`SELECT * FROM users_details where user_id = "${user.user_id}";`);

  if(uid.length != 0){
    res.statusCode = 409;
    res.setHeader('Content-Type', 'text/json');
    res.json({status:false});
  }
  else {
    db.query(`INSERT INTO users_details VALUES ("${user.user_id}", "${user.user_email}", "${user.user_phno}", "${user.user_addline}", "${user.user_pincode}", '${user.user_joindt}');`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json(user);
  }
})
.delete((req, res, next) => {
  res.end('Will add feature to delete profile later!');
});

userdetailsRouter.route('/all_user')
.post(async(req, res, next) => {
  const admin_id = req.body.user_id;
  console.log(admin_id);
  try {
    const [user_list] = await db.query(`SELECT * FROM users;`);
    console.log(user_list);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json(user_list);
  } catch (e) {
    console.log(e);
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/json');
    res.json({status:false});
  }
});

userdetailsRouter.route('/change_role')
.post(async(req, res, next) => {
  const user_id = req.body.user_id;
  const isAdmin = req.body.isAdmin;
  try {
    const [result] = await db.query(`UPDATE users SET isAdmin = ${isAdmin} WHERE user_id = "${user_id}";`)
    console.log(result);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json({message:"Role changed"});
  } catch (e) {
    console.log(e);
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/json');
    res.json({status:false});
  }
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

module.exports = userdetailsRouter;