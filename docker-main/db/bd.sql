-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 18-03-2024 a las 01:33:05
-- Versión del servidor: 8.0.31
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inmobiliaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inquilinos`
--

DROP TABLE IF EXISTS `inquilinos`;
CREATE TABLE IF NOT EXISTS `inquilinos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `apellido` varchar(15) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `documento` varchar(25) NOT NULL,
  `email` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

DROP TABLE IF EXISTS `localidades`;
CREATE TABLE IF NOT EXISTS `localidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedades`
--

DROP TABLE IF EXISTS `propiedades`;
CREATE TABLE IF NOT EXISTS `propiedades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `domicilio` varchar(255) NOT NULL,
  `localidad_id` int NOT NULL,
  `cantidad_habitaciones` int DEFAULT NULL,
  `cantidad_banios` int DEFAULT NULL,
  `cochera` tinyint(1) DEFAULT NULL,
  `cantidad_huespedes` int NOT NULL,
  `fecha_inicio_disponibilidad` date NOT NULL,
  `cantidad_dias` int NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `valor_noche` int NOT NULL,
  `tipo_propiedad_id` int NOT NULL,
  `imagen` text,
  `tipo_imagen` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tipo_propiedad` (`tipo_propiedad_id`),
  KEY `fk_localidades` (`localidad_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

DROP TABLE IF EXISTS `reservas`;
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `propiedad_id` int NOT NULL,
  `inquilino_id` int NOT NULL,
  `fecha_desde` date NOT NULL,
  `cantidad_noches` int NOT NULL,
  `valor_total` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `propiedad_id` (`propiedad_id`),
  KEY `inquilino_id` (`inquilino_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_propiedades`
--

DROP TABLE IF EXISTS `tipo_propiedades`;
CREATE TABLE IF NOT EXISTS `tipo_propiedades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `propiedades`
--
ALTER TABLE `propiedades`
  ADD CONSTRAINT `fk_localidad` FOREIGN KEY (`localidad_id`) REFERENCES `localidades` (`id`),
  ADD CONSTRAINT `fk_tipo_propiedad` FOREIGN KEY (`tipo_propiedad_id`) REFERENCES `tipo_propiedades` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk2_propiedad` FOREIGN KEY (`propiedad_id`) REFERENCES `propiedades` (`id`),
  ADD CONSTRAINT `fk_inquilino` FOREIGN KEY (`inquilino_id`) REFERENCES `inquilinos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;