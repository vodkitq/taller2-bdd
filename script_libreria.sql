-- Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS libreria_doulos;
USE libreria_doulos;

-- 1. Tabla Libro
CREATE TABLE Libro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    editorial VARCHAR(255) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    edad_sugerida INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_recepcion DATE NOT NULL
);

-- 2. Tabla Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Activo'
);

-- 3. Tabla Bibliotecaria
CREATE TABLE Bibliotecaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR(12) UNIQUE NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Activo',
    bono DECIMAL(10, 2) DEFAULT 0,
    sueldo DECIMAL(10, 2) NOT NULL,
    rol VARCHAR(100) NOT NULL
);

-- 4. Tabla Copia
CREATE TABLE Copia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT NOT NULL,
    codigo_barra VARCHAR(100) UNIQUE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Disponible',
    FOREIGN KEY (libro_id) REFERENCES Libro(id)
);

-- 5. Tabla Transaccion
CREATE TABLE Transaccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    bibliotecaria_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha DATETIME NOT NULL,
    semestre INT NOT NULL,
    precio_final DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (libro_id) REFERENCES Libro(id),
    FOREIGN KEY (bibliotecaria_id) REFERENCES Bibliotecaria(id)
);

-- ==========================================
-- INSERCIÓN DE DATOS DE PRUEBA
-- ==========================================

-- Insertar Libros
INSERT INTO Libro (nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion) VALUES
('Fundamentos de Bases de Datos', 'Abraham Silberschatz', 'McGraw Hill', 'Educación', 18, 45000.00, '2025-01-15'),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 'Educación', 16, 35000.00, '2025-02-10'),
('Dune', 'Frank Herbert', 'Chilton Books', 'Ficción', 14, 25000.00, '2026-03-01'),
('El Imperio Final', 'Brandon Sanderson', 'Nova', 'Ficción', 14, 28000.00, '2026-01-20'),
('Buenos Presagios', 'Terry Pratchett y Neil Gaiman', 'Gollancz', 'Comedia', 12, 22000.00, '2025-08-15');

-- Insertar Copias (Asignadas a los libros)
INSERT INTO Copia (libro_id, codigo_barra, estado) VALUES
(1, 'CB-1-0001', 'Disponible'),
(2, 'CB-2-0001', 'Disponible'),
(3, 'CB-3-0001', 'Disponible'),
(3, 'CB-3-0002', 'Vendido'),
(4, 'CB-4-0001', 'Disponible'),
(5, 'CB-5-0001', 'Prestado');

-- Insertar Usuarios 
INSERT INTO Usuario (rut, nombre, edad, direccion) VALUES
('21.345.678-9', 'Carlos Soto', 20, 'Avenida Brasil 123, Antofagasta'),
('20.123.456-7', 'María González', 19, 'Calle Prat 456, Antofagasta');

-- Insertar Bibliotecarias / Encargados
INSERT INTO Bibliotecaria (nombre, rut, correo, contrasena, estado, bono, sueldo, rol) VALUES
('Ana Rojas', '15.987.654-3', 'ana.rojas@doulos.cl', 'hash123', 'Activo', 0, 600000.00, 'Operadora'),
('Luis Pérez', '12.345.678-K', 'luis.perez@doulos.cl', 'hash123', 'Activo', 0, 800000.00, 'Encargado');

-- Insertar Transacciones Estratégicas para probar los endpoints
-- Venta de Ficción en el 1er semestre de 2026 (Endpoint 15)
INSERT INTO Transaccion (usuario_id, libro_id, bibliotecaria_id, tipo, fecha, semestre, precio_final) VALUES
(1, 3, 1, 'Venta', '2026-04-10 10:30:00', 1, 29750.00); 

-- Préstamo de Comedia en el 2do semestre de 2025 (Endpoint 16)
INSERT INTO Transaccion (usuario_id, libro_id, bibliotecaria_id, tipo, fecha, semestre, precio_final) VALUES
(2, 5, 1, 'Prestamo', '2025-10-15 14:00:00', 2, 2200.00);