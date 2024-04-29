-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db:3306
-- Tiempo de generación: 29-04-2024 a las 20:21:14
-- Versión del servidor: 8.0.36
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `seminariophp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inquilinos`
--

CREATE TABLE `inquilinos` (
  `id` int NOT NULL,
  `apellido` varchar(15) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `documento` varchar(25) NOT NULL,
  `email` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `inquilinos`
--

INSERT INTO `inquilinos` (`id`, `apellido`, `nombre`, `documento`, `email`, `activo`) VALUES
(1, 'asdas', 'krina', '6', 'aa', 1),
(2, 'García', 'María', '23456789', 'maria@example.com', 1),
(3, 'Martínez', 'Pedro', '34567890', 'pedro@example.com', 0),
(4, 'Falasca', 'Maximiliano', '4444444', 'maxi@example.com', 1),
(5, 'Sánchez', 'Ana', '56789012', 'ana@example.com', 1),
(6, 'Torres', 'Nacho', '123456781', 'torres@example.com', 0),
(7, 'Hernández', 'Mauro', '123124312', 'mauro@example.com', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `id` int NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`id`, `nombre`) VALUES
(6, 'Adrogue'),
(1, 'Alejandro Korn'),
(9, 'Bandfield'),
(5, 'Burzaco'),
(12, 'Gerli'),
(3, 'Glew'),
(2, 'Guernica'),
(14, 'H. Yrigoyen'),
(8, 'L. Zamora'),
(11, 'Lanus'),
(4, 'Longchamps'),
(15, 'Plaza C.'),
(10, 'R. Escalada'),
(13, 'S y Kosteki'),
(7, 'Temperley');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedades`
--

CREATE TABLE `propiedades` (
  `id` int NOT NULL,
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
  `tipo_imagen` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `propiedades`
--

INSERT INTO `propiedades` (`id`, `domicilio`, `localidad_id`, `cantidad_habitaciones`, `cantidad_banios`, `cochera`, `cantidad_huespedes`, `fecha_inicio_disponibilidad`, `cantidad_dias`, `disponible`, `valor_noche`, `tipo_propiedad_id`, `imagen`, `tipo_imagen`) VALUES
(1, 'Kennedy', 1, 5, NULL, NULL, 4, '2023-01-01', 1, 1, 20, 1, NULL, NULL),
(2, 'Av. Corrientes 123', 2, NULL, NULL, NULL, 4, '2024-05-01', 7, 1, 100, 5, NULL, NULL),
(3, '1 y 50', 15, NULL, NULL, NULL, 7, '2021-01-01', 5, 0, 500, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int NOT NULL,
  `propiedad_id` int NOT NULL,
  `inquilino_id` int NOT NULL,
  `fecha_desde` date NOT NULL,
  `cantidad_noches` int NOT NULL,
  `valor_total` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `propiedad_id`, `inquilino_id`, `fecha_desde`, `cantidad_noches`, `valor_total`) VALUES
(1, 1, 4, '2025-01-01', 30, 200),
(2, 2, 1, '2024-05-02', 15, 1500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_propiedades`
--

CREATE TABLE `tipo_propiedades` (
  `id` int NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_propiedades`
--

INSERT INTO `tipo_propiedades` (`id`, `nombre`) VALUES
(2, 'Apartamento'),
(6, 'Ático'),
(1, 'Casa'),
(8, 'Casa móvil'),
(3, 'Chalet'),
(5, 'Dúplex'),
(7, 'Estudio'),
(4, 'Loft'),
(9, 'Piso');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inquilinos`
--
ALTER TABLE `inquilinos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `propiedades`
--
ALTER TABLE `propiedades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tipo_propiedad` (`tipo_propiedad_id`),
  ADD KEY `fk_localidades` (`localidad_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propiedad_id` (`propiedad_id`),
  ADD KEY `inquilino_id` (`inquilino_id`);

--
-- Indices de la tabla `tipo_propiedades`
--
ALTER TABLE `tipo_propiedades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inquilinos`
--
ALTER TABLE `inquilinos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `propiedades`
--
ALTER TABLE `propiedades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_propiedades`
--
ALTER TABLE `tipo_propiedades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
