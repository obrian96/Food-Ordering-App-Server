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
	try {
	// Check admin id
	admin_id = req.body.admin_id;
	if (admin_id == "" || admin_id == '[]' || admin_id == undefined) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'text/plain');
		res.json({staus: "Admin id must not empty!"});
		return;
	}
	const [isAdmin] = await db.query(`SELECT isAdmin FROM users WHERE user_id = "${admin_id}";`);
	console.log(isAdmin);
	if (isAdmin == "" || isAdmin == '[]' || isAdmin == undefined) {
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

orderManagementRoute.route('/ordered_user_list')
.post(async(req, res, next) => {
	try {
		admin_id = req.body.user_id;
		if (admin_id == "" || admin_id == '[]' || admin_id == undefined) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'text/plain');
			res.json({status: "Admin id must not empty!"});
			return;
		}
		const [isAdmin] = await db.query(`SELECT isAdmin FROM users WHERE user_id = "${admin_id}";`);
		console.log(JSON.stringify(isAdmin, null, 4));
		if (isAdmin == "" || isAdmin == '[]' || isAdmin == undefined) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.json({"statue":"Account does not exist!"});
			return;
		}
		if(isAdmin[0].isAdmin == 1) {
			const [ordered_user_id_list] = await db.query(`
				SELECT MIN(id) AS id, user_id FROM orders GROUP BY user_id;
				`);
			console.log(ordered_user_id_list.length);
			let user_id_list = [], user_name_list = [], user_image_list = [];

			for (let i = 0; i < ordered_user_id_list.length; i++) {
				console.log(ordered_user_id_list[i].user_id);
				user_id_list.push("'" + ordered_user_id_list[i].user_id + "'");
			}
			let query = `
				SELECT * FROM users WHERE user_id IN (${user_id_list});
				`;
			console.log(query);
			const [ordered_user_list] = await db.query(query);
			console.log(ordered_user_list);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.json(ordered_user_list);
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
