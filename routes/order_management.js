// Order management route for admin account

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('config');
const moment = require('moment');

const orderManagementRoute = express.Router();

orderManagementRoute.use(bodyParser.json());

orderManagementRoute.route('/')
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
	// Check admin id
	admin_id = req.body.admin_id;
	try {
		const [isAdmin] = await db.query(`SELECT isAdmin FROM users WHERE user_id = "${admin_id}";`);
		console.log(isAdmin);
		if (isAdmin == []) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.json({"statue":"Account does not exist!"});
			return;
		}
		if(isAdmin[0].isAdmin == 1) {
			const [orders] = await db.query(`
				SELECT * FROM orders;
				`);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.json(orders);
		} else {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'text/plain');
			res.json({"status":"Unauthorized"});
		}
	} catch (e) {
		console.log(e);
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

module.exports = orderManagementRoute;
