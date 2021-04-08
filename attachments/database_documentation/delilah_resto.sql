-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-02-2021 a las 19:36:09
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah_resto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderr`
--

CREATE TABLE `orderr` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_payment_method` varchar(50) NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `order_creation_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orderr`
--

INSERT INTO `orderr` (`order_id`, `user_id`, `order_payment_method`, `order_status`, `order_creation_date`) VALUES
(2, 41, 'Tarjeta', 'Confirmado', '2021-01-16 13:22:50'),
(3, 41, 'Efectivo', 'Preparando', '2021-01-16 13:23:19'),
(4, 41, 'Tarjeta', 'Enviando', '2021-01-16 13:24:03'),
(5, 42, 'Efectivo', 'Entregado', '2021-01-16 13:25:11'),
(6, 40, 'Efectivo', 'Nuevo', '2021-02-01 12:47:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_product_relation`
--

CREATE TABLE `order_product_relation` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `order_product_relation`
--

INSERT INTO `order_product_relation` (`order_id`, `product_id`, `quantity`) VALUES
(2, 21, 1),
(2, 28, 2),
(3, 21, 1),
(3, 28, 2),
(4, 25, 2),
(5, 24, 1),
(6, 21, 1),
(6, 22, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_description` varchar(200) NOT NULL,
  `product_price` double NOT NULL,
  `product_picture_path` varchar(1000) NOT NULL,
  `product_available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_description`, `product_price`, `product_picture_path`, `product_available`) VALUES
(20, 'Lomito completo', 'Lomo de carne, tomate, lechuga y huevo', 500, '', 3),
(21, 'Lomito super complet0', 'Lomito completo + papas con cheddar', 670, '', 1),
(22, 'Hamburguesa Portobello', 'Hamburguesa vegetariana con Hongos', 1800, '', 3),
(24, 'Gaseosa', 'Bebida con mucho gas para el fernet', 154, '', 3),
(25, 'Agua saborizada', 'Bebida con sabor', 145, '', 3),
(26, 'Ensalada', 'Para gente a dieta', 350, '', 3),
(27, 'Milanesa a la napolitana', 'Con salsa y queso', 450, '', 3),
(28, 'Papas Fritas', 'Porcion abundante', 320, '', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_first_name` varchar(100) NOT NULL,
  `user_last_name` varchar(100) NOT NULL,
  `user_email` varchar(200) NOT NULL,
  `user_phone_number` varchar(100) NOT NULL,
  `user_address` varchar(200) NOT NULL,
  `username` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`user_id`, `user_first_name`, `user_last_name`, `user_email`, `user_phone_number`, `user_address`, `username`, `user_password`, `user_role`) VALUES
(39, 'Federico', 'Raimondo', 'fede_93@gmail.com', '812381283', 'm89 c31', 'rai', '1234', 'Administrator'),
(40, 'Federico1', 'Raimondo1', 'fede_94@gmail.com', '1122', 'm81 c30', 'rai2', '1234', 'User'),
(41, 'Federico2', 'Raimondo2', 'fede_95@gmail.com', '1123', 'm82 c30', 'rai3', '1234', 'User'),
(42, 'Federico3', 'Raimondo3', 'fede_96@gmail.com', '1124', 'm83 c30', 'rai4', '1234', 'User'),
(43, 'Federico4', 'Raimondo4', 'fede_97@gmail.com', '1125', 'm84 c30', 'rai5', '1234', 'User');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_product_relation`
--

CREATE TABLE `user_product_relation` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_product_relation`
--

INSERT INTO `user_product_relation` (`user_id`, `product_id`) VALUES
(39, 20),
(39, 21),
(40, 20),
(40, 21),
(41, 20),
(41, 21),
(42, 20),
(43, 20);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orderr`
--
ALTER TABLE `orderr`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `order_product_relation`
--
ALTER TABLE `order_product_relation`
  ADD PRIMARY KEY (`order_id`,`product_id`,`quantity`),
  ADD KEY `product_id_1` (`product_id`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`,`product_name`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indices de la tabla `user_product_relation`
--
ALTER TABLE `user_product_relation`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `product_id_2` (`product_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orderr`
--
ALTER TABLE `orderr`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Filtros para la tabla `order_product_relation`
--
ALTER TABLE `order_product_relation`
  ADD CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orderr` (`order_id`),
  ADD CONSTRAINT `product_id_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Filtros para la tabla `user_product_relation`
--
ALTER TABLE `user_product_relation`
  ADD CONSTRAINT `product_id_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  ADD CONSTRAINT `user_id_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
