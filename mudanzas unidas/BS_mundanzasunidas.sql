-- Base de datos para una empresa de mudanzas

-- Crear base de datos
CREATE DATABASE EmpresaMudanzasunidas;
USE EmpresaMudanzasunidas;

-- Tabla para almacenar los datos de los clientes
CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Email VARCHAR(100),
    Direccion VARCHAR(255),
    Ciudad VARCHAR(100),
    CodigoPostal VARCHAR(10),
    FechaRegistro DATE DEFAULT CURRENT_DATE
);

-- Tabla para almacenar los datos de los empleados
CREATE TABLE Empleados (
    EmpleadoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Email VARCHAR(100),
    Cargo VARCHAR(50),
    FechaContratacion DATE,
    Salario DECIMAL(10, 2)
);

-- Tabla para almacenar los vehículos disponibles
CREATE TABLE Vehiculos (
    VehiculoID INT AUTO_INCREMENT PRIMARY KEY,
    Marca VARCHAR(50),
    Modelo VARCHAR(50),
    Placa VARCHAR(15) UNIQUE NOT NULL,
    CapacidadToneladas DECIMAL(5, 2),
    Disponibilidad BOOLEAN DEFAULT TRUE
);

-- Tabla para registrar las mudanzas
CREATE TABLE Mudanzas (
    MudanzaID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteID INT,
    Fecha DATE NOT NULL,
    DireccionOrigen VARCHAR(255) NOT NULL,
    DireccionDestino VARCHAR(255) NOT NULL,
    VehiculoID INT,
    EmpleadoID INT,
    Costo DECIMAL(10, 2),
    Estado ENUM('Pendiente', 'En Proceso', 'Completada') DEFAULT 'Pendiente',
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
    FOREIGN KEY (VehiculoID) REFERENCES Vehiculos(VehiculoID),
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID)
);

-- Tabla para detallar los objetos a trasladar en cada mudanza
CREATE TABLE ObjetosMudanza (
    ObjetoID INT AUTO_INCREMENT PRIMARY KEY,
    MudanzaID INT,
    Descripcion VARCHAR(255),
    Peso DECIMAL(5, 2),
    Volumen DECIMAL(5, 2),
    Cantidad INT DEFAULT 1,
    FOREIGN KEY (MudanzaID) REFERENCES Mudanzas(MudanzaID)
);

-- Tabla para almacenar valoraciones de clientes
CREATE TABLE Valoraciones (
    ValoracionID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteID INT,
    MudanzaID INT,
    Calificacion INT CHECK (Calificacion BETWEEN 1 AND 5),
    Comentario TEXT,
    Fecha DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
    FOREIGN KEY (MudanzaID) REFERENCES Mudanzas(MudanzaID)
);
