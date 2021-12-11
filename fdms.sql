-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2021 at 09:35 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fdms`
--
CREATE DATABASE IF NOT EXISTS `fdms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `fdms`;

-- --------------------------------------------------------

--
-- Table structure for table `dishes`
--
-- Creation: Dec 09, 2021 at 04:30 PM
--

DROP TABLE IF EXISTS `dishes`;
CREATE TABLE IF NOT EXISTS `dishes` (
  `dish_id` int(11) NOT NULL,
  `dish_name` varchar(255) NOT NULL,
  `dish_price` int(11) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL,
  `dish_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dish_id`),
  UNIQUE KEY `dish_id` (`dish_id`)
) ;

--
-- Dumping data for table `dishes`
--

INSERT INTO `dishes` (`dish_id`, `dish_name`, `dish_price`, `isAvailable`, `dish_type`) VALUES
(1, 'Aloo paratha', 40, 1, 'main course'),
(2, 'Gulab Jamun', 60, 1, 'dessert'),
(3, 'Coca Cola', 20, 1, 'beverage');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--
-- Creation: Dec 11, 2021 at 06:22 PM
-- Last update: Dec 11, 2021 at 08:32 PM
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `start_date` date NOT NULL DEFAULT current_timestamp(),
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders_history`
--
-- Creation: Dec 09, 2021 at 12:11 PM
--

DROP TABLE IF EXISTS `orders_history`;
CREATE TABLE IF NOT EXISTS `orders_history` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_price` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `order_qty` int(11) NOT NULL,
  `order_dish_id` int(11) NOT NULL,
  `order_user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `order_dish_id` (`order_dish_id`),
  KEY `order_user_id` (`order_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders_history`
--

INSERT INTO `orders_history` (`order_id`, `order_price`, `order_date`, `order_qty`, `order_dish_id`, `order_user_id`) VALUES
(3, 3, '2021-12-01', 1, 3, 'a7b06900');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--
-- Creation: Dec 11, 2021 at 04:11 PM
-- Last update: Dec 11, 2021 at 08:32 PM
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` decimal(19,3) NOT NULL,
  `price` decimal(19,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_id` (`order_id`),
  KEY `fk_item_id` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Creation: Dec 09, 2021 at 12:11 PM
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_pass`, `isAdmin`) VALUES
('0c975dea', 'Serial', '12345678', 0),
('a7b06900', 'Rellik Jaeger', '12345678', 1),
('userid1', 'Arunoday kumar', 'password1', 0),
('userid2', 'Kapil kumar', 'password2', 0),
('userid3', 'Ashish Singh', 'password3', 1),
('userid4', 'Shivam Malpaani', 'password4', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users_details`
--
-- Creation: Dec 09, 2021 at 12:11 PM
--

DROP TABLE IF EXISTS `users_details`;
CREATE TABLE IF NOT EXISTS `users_details` (
  `user_id` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phno` varchar(255) NOT NULL,
  `user_addline` varchar(555) NOT NULL,
  `user_pincode` int(20) NOT NULL,
  `user_joindt` date NOT NULL,
  PRIMARY KEY (`user_email`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_details`
--

INSERT INTO `users_details` (`user_id`, `user_email`, `user_phno`, `user_addline`, `user_pincode`, `user_joindt`) VALUES
('userid1', 'arunoday@gmail.com', '1111111111', 'Address of arunoday', 111111, '2021-04-24'),
('userid3', 'ashish@gmail.com', '3333333333', 'Address of ashish', 333333, '2021-04-24'),
('userid2', 'kapil@gmail.com', '2222222222', 'Address of kapil', 222222, '2021-04-24'),
('a7b06900', 'rellikjaeger@gmail.com', '', '', 0, '2021-12-09'),
('0c975dea', 'serialboylay@gmail.com', '', '', 0, '2021-12-09'),
('userid4', 'shivam@gmail.com', '4444444444', 'Address of shivam', 444444, '2021-04-24');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `orders_history`
--
ALTER TABLE `orders_history`
  ADD CONSTRAINT `orders_history_ibfk_1` FOREIGN KEY (`order_dish_id`) REFERENCES `dishes` (`dish_id`),
  ADD CONSTRAINT `orders_history_ibfk_2` FOREIGN KEY (`order_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_item_id` FOREIGN KEY (`item_id`) REFERENCES `dishes` (`dish_id`),
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `users_details`
--
ALTER TABLE `users_details`
  ADD CONSTRAINT `users_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
