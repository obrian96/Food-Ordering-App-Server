
-- CREATE

CREATE SCHEMA IF NOT EXISTS FDMS;

USE FDMS;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(255) PRIMARY KEY NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users_details` (
  `user_id` varchar(255) NOT NULL,
  `user_email` varchar(255) PRIMARY KEY NOT NULL,
  `user_phno` varchar(255) NOT NULL,
  `user_addline` varchar(555) NOT NULL,
  `user_pincode` int(20) NOT NULL,
  `user_joindt` date NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `restaurant` (
  `rest_id` varchar(255) PRIMARY KEY NOT NULL,
  `rest_email` varchar(255) NOT NULL,
  `rest_phno` varchar(255) NOT NULL,
  `rest_addline` varchar(555) NOT NULL,
  `rest_pincode` varchar(555) NOT NULL,
  `rest_joindt` date NOT NULL,
  `rest_owner_id` varchar(255) NOT NULL,
  FOREIGN KEY (rest_owner_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `dishes` (
  `dish_id` int(11) PRIMARY KEY NOT NULL,
  `dish_name` varchar(255) NOT NULL,
  `dish_price` int(11) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL,
  `dish_type` varchar(255) DEFAULT NULL,
  CONSTRAINT chk_dish_type CHECK (dish_type IN ('starter', 'main course',
    'dessert',
    'snack',
    'beverage')),
  `dish_rest_id` varchar(255) NOT NULL,
  FOREIGN KEY (dish_rest_id) REFERENCES restaurant (rest_id)
) ;

CREATE TABLE IF NOT EXISTS `orders_history` (
  `order_id` int(11) PRIMARY KEY NOT NULL,
  `order_price` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `order_qty` int(11) NOT NULL,
  `order_dish_id` int(11) NOT NULL,
  FOREIGN KEY (order_dish_id) REFERENCES dishes (dish_id),
  `order_user_id` varchar(255) NOT NULL,
  FOREIGN KEY (order_user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT

INSERT INTO `users` (`user_id`, `user_name`, `user_pass`, `isAdmin`) VALUES
('userid1', 'Arunoday kumar', 'password1', 0),
('userid2', 'Kapil kumar', 'password2', 0),
('userid3', 'Ashish Singh', 'password3', 1),
('userid4', 'Shivam Malpaani', 'password4', 1);

INSERT INTO `users_details` (`user_id`, `user_email`, `user_phno`, `user_addline`, `user_pincode`, `user_joindt`) VALUES
('userid1', 'arunoday@gmail.com', '1111111111', 'Address of arunoday', 111111, '2021-04-24'),
('userid3', 'ashish@gmail.com', '3333333333', 'Address of ashish', 333333, '2021-04-24'),
('userid2', 'kapil@gmail.com', '2222222222', 'Address of kapil', 222222, '2021-04-24'),
('userid4', 'shivam@gmail.com', '4444444444', 'Address of shivam', 444444, '2021-04-24');

INSERT INTO `restaurant` (`rest_id`, `rest_email`, `rest_phno`, `rest_addline`, `rest_pincode`, `rest_joindt`, `rest_owner_id`) VALUES
('restid1', 'rest1@gmail.com', '1111111111', '1 apps, 1 street, 1 landmark restaurant', '111111', '2011-01-11', 'userid3'),
('restid2', 'rest2@gmail.com', '2222222222', '2 apps, 2 street, 2 landmark restaurant', '222222', '2020-02-02', 'userid4'),
('restid3', 'rest3@gmail.com', '3333333333', '3 apps, 3 street, 3 landmark restaurant', '333333', '2020-04-21', 'userid4');

INSERT INTO `dishes` (`dish_id`, `dish_name`, `dish_price`, `isAvailable`, `dish_type`, `dish_rest_id`) VALUES
(1, 'Aloo paratha', 40, 1, 'main course', 'restid1'),
(2, 'Gulab Jamun', 60, 1, 'dessert', 'restid2'),
(3, 'Coca Cola', 20, 1, 'beverage', 'restid2');

-- TEST

SELECT * FROM dishes;
SELECT * FROM users;
SELECT * FROM users_details;
SELECT * FROM orders_history;
SELECT * FROM restaurant;
