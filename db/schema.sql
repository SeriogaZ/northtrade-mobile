-- MySQL schema + seed data for the Node.js app

CREATE DATABASE IF NOT EXISTS `ca2_sergejs` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ca2_sergejs`;

DROP TABLE IF EXISTS `records`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `records` (
  `recordID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`recordID`),
  KEY `idx_records_category` (`categoryID`),
  CONSTRAINT `fk_records_category`
    FOREIGN KEY (`categoryID`) REFERENCES `categories` (`categoryID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`categoryID`, `categoryName`) VALUES
(1, 'iPhones'),
(2, 'Samsungs'),
(3, 'Xiaomi'),
(4, 'Nokia'),
(5, 'Huawei'),
(6, 'Google'),
(7, 'Motorola');

INSERT INTO `records` (`recordID`, `categoryID`, `name`, `price`, `image`) VALUES
(1, 1 , 'iPhone 1', '40', 'iPhone1.jpg'),
(2, 1 , 'iPhone 2', '20', 'iPhone2.jpg'),
(3, 1 , 'iPhone 3', '50', 'iPhone3.jpg'),
(4, 1 , 'iPhone 4', '90', 'iPhone4.jpg'),
(5, 1 , 'iPhone 5', '120', 'iPhone5.jpg'),
(6, 1 , 'iPhone 6', '150', 'iPhone6.jpg'),
(7, 1 , 'iPhone 7', '180', 'iPhone7.jpg'),
(8, 1 , 'iPhone 8', '320', 'iPhone8.jpg'),
(9, 1 , 'iPhone X', '400', 'iPhoneX.jpg'),
(10, 1 , 'iPhone 11', '570', 'iPhone11.jpg'),
(11, 1 , 'iPhone 12', '839', 'iPhone12.jpg'),
(12, 1 , 'iPhone 13', '1299', 'iPhone13.jpg'),
(13, 2, 'Samsung Galaxy', '40', 'samsung1.jpg'),
(14, 2, 'Samsung Galaxy s2', '20', 'samsung2.jpg'),
(15, 2, 'Samsung Galaxy s4', '55', 'samsung4.jpg'),
(16, 2, 'Samsung Galaxy s5', '80', 'samsung5.jpg'),
(17, 2, 'Samsung Edge 6s', '222', 'samsung6.jpg'),
(18, 2, 'Samsung Galaxy s7', '301', 'samsung7.jpg'),
(19, 2, 'Samsung Galaxy s8', '400', 'samsung8.jpg'),
(20, 2, 'Samsung Galaxy s10', '430', 'samsung10.jpg'),
(21, 2, 'Samsung Galaxy s21', '1200', 'samsung21.jpg'),
(22, 2, 'Samsung A52 Ulta', '400', 'samsungA52.jpg'),
(23, 3, 'Xiaomi One', '69', 'xiaomi1.jpg'),
(24, 3, 'Xiaomi Two', '102', 'xiaomi2.jpg'),
(25, 3, 'Xiaomi Xi', '105', 'xiaomi3.jpg'),
(26, 3, 'Xiaomi 5', '232', 'xiaomi5.jpg'),
(27, 3, 'Xiaomi 7', '500', 'xiaomi7.jpg'),
(28, 3, 'Xiaomi 10 Mi10', '700', 'xiaomi10.jpg'),
(29, 3, 'Xiaomi 11 Lite', '790', 'xiaomi11.jpg'),
(30, 4, 'Nokia First', '40', 'nokia1.jpg'),
(31, 4, 'Nokia 2', '80', 'nokia2.jpg'),
(32, 4, 'Nokia 5', '139', 'nokia5.jpg'),
(33, 4, 'Nokia XR', '900', 'nokia10.jpg'),
(34, 4, 'Nokia 1100', '40', 'nokia1100.jpg'),
(35, 4, 'Nokia 3310', '1000000', 'nokia3310.jpg'),
(36, 4, 'Nokia 6310', '60000', 'nokia6310.jpg'),
(37, 5, 'Huawei P10', '90', 'huaweiP10.jpg'),
(38, 5, 'Huawei P20', '200', 'huaweiP20.jpg'),
(39, 5, 'Huawei P30', '300', 'huaweiP30.jpg'),
(40, 5, 'Huawei P40', '400', 'huaweiP40.jpg'),
(41, 5, 'Huawei P50', '1200', 'huaweiP50.jpg'),
(42, 6, 'Google Pixel 1', '120', 'googlePixel1.jpg'),
(43, 6, 'Google Pixel 2', '190', 'googlePixel2.jpg'),
(44, 6, 'Google Pixel 3', '209', 'googlePixel3.jpg'),
(45, 6, 'Google Pixel 4', '400', 'googlePixel4.jpg'),
(46, 6, 'Google Pixel 5', '990', 'googlePixel5.jpg'),
(47, 7, 'Motorola One', '50', 'motorola1.jpg'),
(48, 7, 'Motorola G12', '200', 'motorola10.jpg'),
(49, 7, 'Motorola G82', '999', 'motorola12.jpg');

