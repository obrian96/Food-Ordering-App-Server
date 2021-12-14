// Placing new orders for user account

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('config');
const moment = require('moment');

const newOrderRoute = express.Router();

newOrderRoute.use(bodyParser.json());

newOrderRoute.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get(async(req, res, next) => {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.json();
})
.post(async(req, res, next) => {
	console.log(req.body);
	if (!req.body) {
		return res.sendStatus(400);
	} else {
		// var newOrder = req.body,
		// orderItems = [],
		// item;

		// for (item in newOrder) {
		// 	orderItems.push(newOrder[item]);
		// }

		// if (!orderItems.length) {
		// 	return res.status(200).send({status: "Nothing found in new order!"});
		// } else {
		// 	console.log(orderItems);
		// }
		var user_id = req.body.user_id;
		var total_price = req.body.total_price;
		var order_items = req.body.order_items;
		if (order_items == '[]') {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'text/plain');
			res.json({status:'No item!'});
			return;
		}
		var item_ids = [];
		var dish_quantities = [];
		var dish_prices = [];
		var order_id;

		// Collect item id
		JSON.parse(order_items).forEach(item => {
			item_ids.push(item.dish_id);
			dish_quantities.push(item.dish_quantity);
			dish_prices.push(item.dish_price);
		});

		console.log(item_ids);

		// Insert new order record to orders table
		const [orders_result] = await db.query(`
			INSERT INTO orders (user_id, total_price) VALUES ("${user_id}", "${total_price}");
			`);

		// Get order id
		order_id = orders_result.insertId;

		var sql_values = "";

		for (i in item_ids) {
			var item_id = item_ids[i];
			var quantity = dish_quantities[i];
			var price = dish_prices[i];
			if (sql_values != "" && i < item_ids.length) sql_values += `, `;
			sql_values += `(${order_id}, ${item_id}, ${quantity}, ${price})`;
		}

		var sqlQuery = `INSERT INTO order_items (order_id, item_id, quantity, price) 
			VALUES ${sql_values};`;

		console.log(sqlQuery);

		// Insert new order items for each item quantity and price
		const [order_items_result] = await db.query(sqlQuery);

		console.log(order_items_result);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.json({message: "New order added!"});
	}
});

async function main() {
	db = await mysql.createConnection({
		host: config.get('db.host'),
		user: config.get('db.user'),
		password: config.get('db.password'),
		database: config.get('db.database'),
		timezone: config.get('db.timezone'),
		charset: config.get('db.charset'),
	});
}

main();

module.exports = newOrderRoute;
