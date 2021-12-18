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
				SELECT id, user_id FROM orders GROUP BY user_id ORDER BY id DESC;
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
			let sorted_user_list = sortUserId(user_id_list, ordered_user_list);
			console.log(sorted_user_list);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.json(sorted_user_list);
		} else {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'text/plain');
			res.json({"status":"Unauthorized"});
		}
	} catch (e) {
		console.log(e);
	}
});

function sortUserId(referenceList, targetList) {
	console.log('---\nUser ID Sorting Started!\n---');
	let sortedList = [];
	for (let i = 0; i < referenceList.length; i++) {
		for (let j = 0; j < targetList.length; j++) {
			console.log('Finding: match user id: ' + referenceList[i].split("'")[1] + ':' + targetList[j].user_id);
			if (referenceList[i].split("'")[1] == targetList[j].user_id) {
				console.log('---\nFound  : match user id: ' + referenceList[i].split("'")[1] + ':' + targetList[j].user_id + '\n---');
				sortedList.push(targetList[j]);
				break;
			}
		}
	}
	console.log('---\nUser ID Sorting Complete!\n---');
	return sortedList;
}

orderManagementRoute.route('/order_list')
.post(async(req, res, next) => {
	try {
		var user_id = req.body.user_id;
		console.log(user_id);
		const [order_list] = await db.query(`SELECT * FROM orders WHERE user_id = '${user_id}' ORDER BY id DESC;`);
		console.log(order_list);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.json(order_list);
	} catch (e) {
		console.log(e);
	}
});

orderManagementRoute.route('/order_items')
.post(async(req, res, next) => {
	try {
		var order_id = req.body.order_id;
		console.log(order_id);
		sql = `SELECT * FROM order_items WHERE order_id = '${order_id}';`;
		const [order_items] = await db.query(sql);
		console.log(order_items.length);
		if (order_items.length == 0) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.json({"status":"Order not found!"});
			return;
		}
		let item_id_list = [];
		for (let i = 0; i < order_items.length; i++) {
			console.log(order_items[i].item_id);
			item_id_list.push("'" + order_items[i].item_id + "'");
		}
		let query = `
		SELECT * FROM dishes WHERE dish_id IN (${item_id_list});
		`;
		console.log(query);
		const [dish_list] = await db.query(query);
		let total_price = 0;
		for (i in order_items) {
			total_price += order_items[i].price;
		}
		console.log('Total Price: ' + total_price);
		console.log(JSON.stringify({"order_items":order_items,"dish_list":dish_list}, null, 4));
		let sorted_dish_list = sortDishId(item_id_list, dish_list)
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.json({"order_items":order_items,"dish_list":sorted_dish_list});
	} catch (e) {
		console.log(e);
	}
});

function sortDishId(referenceList, targetList) {
	console.log('---\nOrder Dish Sorting Started!\n---');
	let sortedList = [];
	for (let i = 0; i < referenceList.length; i++) {
		for (let j = 0; j < targetList.length; j++) {
			console.log('Finding: match dish id: ' + referenceList[i].split("'")[1] + ':' + targetList[j].dish_id);
			if (referenceList[i].split("'")[1] == targetList[j].dish_id) {
				console.log('---\nFound  : match dish id: ' + referenceList[i].split("'")[1] + ':' + targetList[j].dish_id + '\n---');
				sortedList.push(targetList[j]);
				break;
			}
		}
	}
	console.log('---\nOrder Dish Sorting Complete!\n---');
	return sortedList;
}

orderManagementRoute.route('/change_order_status')
.post(async(req, res, next) => {
	const order_id = req.body.order_id;
	const order_status = req.body.order_status;
	try {
		const [result] = await db.query(`UPDATE orders SET status = ${order_status} WHERE id = ${order_id};`)
		console.log(result);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		res.json({message:"Order Status Changed"});
	} catch (e) {
		console.log(e);
		res.statusCode = 401;
		res.setHeader('Content-Type', 'text/json');
		res.json({status:false});
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
