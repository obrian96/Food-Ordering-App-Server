-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2021 at 11:17 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `dishes`
--

CREATE TABLE `dishes` (
  `dish_id` int(11) NOT NULL,
  `dish_name` varchar(255) NOT NULL,
  `dish_price` int(11) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL,
  `dish_type` varchar(255) DEFAULT NULL,
  `dish_rest_id` varchar(255) NOT NULL
) ;

--
-- Dumping data for table `dishes`
--

INSERT INTO `dishes` (`dish_id`, `dish_name`, `dish_price`, `isAvailable`, `dish_type`, `dish_rest_id`) VALUES
(1, 'Aloo paratha', 40, 1, 'main course', 'restid1'),
(2, 'Gulab Jamun', 60, 1, 'dessert', 'restid2'),
(3, 'Coca Cola', 20, 1, 'beverage', 'restid2');

-- --------------------------------------------------------

--
-- Table structure for table `orders_history`
--

CREATE TABLE `orders_history` (
  `order_id` int(11) NOT NULL,
  `order_price` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `order_qty` int(11) NOT NULL,
  `order_dish_id` int(11) NOT NULL,
  `order_user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `rest_id` varchar(255) NOT NULL,
  `rest_email` varchar(255) NOT NULL,
  `rest_phno` varchar(255) NOT NULL,
  `rest_addline` varchar(555) NOT NULL,
  `rest_pincode` varchar(555) NOT NULL,
  `rest_joindt` date NOT NULL,
  `rest_owner_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`rest_id`, `rest_email`, `rest_phno`, `rest_addline`, `rest_pincode`, `rest_joindt`, `rest_owner_id`) VALUES
('restid1', 'rest1@gmail.com', '1111111111', '1 apps, 1 street, 1 landmark restaurant', '111111', '2011-01-11', 'userid3'),
('restid2', 'rest2@gmail.com', '2222222222', '2 apps, 2 street, 2 landmark restaurant', '222222', '2020-02-02', 'userid4'),
('restid3', 'rest3@gmail.com', '3333333333', '3 apps, 3 street, 3 landmark restaurant', '333333', '2020-04-21', 'userid4');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_pass`, `isAdmin`) VALUES
('userid1', 'Arunoday kumar', 'password1', 0),
('userid2', 'Kapil kumar', 'password2', 0),
('userid3', 'Ashish Singh', 'password3', 1),
('userid4', 'Shivam Malpaani', 'password4', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users_details`
--

CREATE TABLE `users_details` (
  `user_id` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phno` varchar(255) NOT NULL,
  `user_addline` varchar(555) NOT NULL,
  `user_pincode` int(20) NOT NULL,
  `user_joindt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_details`
--

INSERT INTO `users_details` (`user_id`, `user_email`, `user_phno`, `user_addline`, `user_pincode`, `user_joindt`) VALUES
('userid1', 'arunoday@gmail.com', '1111111111', 'Address of arunoday', 111111, '2021-04-24'),
('userid3', 'ashish@gmail.com', '3333333333', 'Address of ashish', 333333, '2021-04-24'),
('userid2', 'kapil@gmail.com', '2222222222', 'Address of kapil', 222222, '2021-04-24'),
('userid4', 'shivam@gmail.com', '4444444444', 'Address of shivam', 444444, '2021-04-24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`dish_id`),
  ADD KEY `dish_rest_id` (`dish_rest_id`);

--
-- Indexes for table `orders_history`
--
ALTER TABLE `orders_history`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `order_dish_id` (`order_dish_id`),
  ADD KEY `order_user_id` (`order_user_id`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`rest_id`),
  ADD KEY `rest_owner_id` (`rest_owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users_details`
--
ALTER TABLE `users_details`
  ADD PRIMARY KEY (`user_email`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `dish_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders_history`
--
ALTER TABLE `orders_history`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `dishes_ibfk_1` FOREIGN KEY (`dish_rest_id`) REFERENCES `restaurant` (`rest_id`);

--
-- Constraints for table `orders_history`
--
ALTER TABLE `orders_history`
  ADD CONSTRAINT `orders_history_ibfk_1` FOREIGN KEY (`order_dish_id`) REFERENCES `dishes` (`dish_id`),
  ADD CONSTRAINT `orders_history_ibfk_2` FOREIGN KEY (`order_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`rest_owner_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users_details`
--
ALTER TABLE `users_details`
  ADD CONSTRAINT `users_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
