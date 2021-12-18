const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const config = require('config');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json({
  limit: '50mb'
}));

dishRouter.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));

dishRouter.use(express.json());

dishRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get( async (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const [rows] = await db.query("SELECT * FROM dishes;");
  res.json(rows);
  next();
})
.post((req, res, next) => {
  const dish = {
    dish_image: req.body.dish_image,
    dish_name: req.body.dish_name,
    dish_price: req.body.dish_price,
    isAvailable: req.body.isAvailable,
    dish_type: req.body.dish_type.toLowerCase(),
  }

  console.log(dish);

  var currDishType = dish.dish_type;
  var types = ['starter','main course','dessert', 'snack', 'beverage'];
  if (types.indexOf(currDishType) >= 0) {
    try {
      db.query(`INSERT INTO dishes ( dish_name, dish_price, dish_image, 
        isAvailable, dish_type ) VALUES ( "${dish.dish_name}", ${dish.dish_price}, 
        "${dish.dish_image}", ${dish.isAvailable}, "${dish.dish_type}" );`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/json');
      res.json(dish);
    } catch (e) {
      console.log(e);
    }
  }else{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/json');
    res.json({"status":"false"});
  }
});

dishRouter.route('/:dishID')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
}).put((req, res, next) => {
  const dish = {
    dish_image: req.body.dish_image,
    dish_name: req.body.dish_name,
    dish_price: req.body.dish_price,
    isAvailable: req.body.isAvailable,
    dish_type: req.body.dish_type.toLowerCase(),
    dish_rest_id: req.body.dish_rest_id
  }

  console.log(dish);
  var currDishType = dish.dish_type;
  var types = ['starter','main course','dessert', 'snack', 'beverage'];
  try {
    db.query(`UPDATE dishes SET dish_name = "${dish.dish_name}", 
      dish_price = ${dish.dish_price}, dish_image = "${dish.dish_image}", 
      isAvailable= ${dish.isAvailable}, dish_type= "${dish.dish_type}" WHERE dish_id = ${req.params.dishID};`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.json(dish);
  } catch (e) {
    console.log(e);
  }
})
.delete(async (req, res, next) => {
  await db.query(`DELETE FROM dishes WHERE dish_id = ${req.params.dishID};`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
  res.json({message:"Dish deleted!"});
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

module.exports = dishRouter;
