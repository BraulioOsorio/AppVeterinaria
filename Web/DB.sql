CREATE DATABASE VETERINARIA;

USE VETERINARIA;

CREATE TABLE USER(
    ID_USER INT AUTO_INCREMENT PRIMARY KEY,
    IDENTIFICATION VARCHAR(20) UNIQUE,
    PHONE VARCHAR(20) UNIQUE,
    NAME VARCHAR(100),
    LASTNAME VARCHAR(100),
    EMAIL VARCHAR(255) UNIQUE,
    PASS VARCHAR(200),
    CARGO ENUM('ADMIN','PROPIETARIO','TRABADOR'),
    STATE ENUM('ACTIVO','INACTIVO')
);

CREATE TABLE VET(
    ID_VET INT AUTO_INCREMENT PRIMARY KEY,
    IDENTIFICATION_ADMIN INT,
    ADDRESS VARCHAR(255) UNIQUE,
    PROFITS FLOAT(10,2),
    LOSS FLOAT(10,2),
    STATE ENUM('ACTIVO','INACTIVO'),
    FOREIGN KEY (IDENTIFICATION_ADMIN) REFERENCES USER(ID_USER)
);

CREATE TABLE MANAGER(
    ID_MANAGER INT AUTO_INCREMENT PRIMARY KEY,
    ADDRESS_MANAGER VARCHAR(200),
    PHONE_MANAGER VARCHAR(20) UNIQUE,
    FULLNAME VARCHAR(200),
    STATE ENUM('ACTIVO','INACTIVO')
);

CREATE TABLE RACE(
    ID_RACE INT AUTO_INCREMENT PRIMARY KEY,
    RACE VARCHAR(100),
    ID_VET INT,
    STATE ENUM('ACTIVO','INACTIVO'),
    FOREIGN KEY (ID_VET) REFERENCES VET(ID_VET)

); 

CREATE TABLE PET(
    ID_PET INT AUTO_INCREMENT PRIMARY KEY,
    ID_VET INT,
    IDENTIFICATION_PET INT UNIQUE,
    NAME_PET VARCHAR(255),
    ID_MANAGER INT,
    ID_RACE INT,
    COLOR VARCHAR(90),
    SIZE VARCHAR(90),
    AGE VARCHAR(90),
    WEIGHT VARCHAR(90),
    STATE ENUM('ACTIVO','INACTIVO'),
    FOREIGN KEY (ID_VET) REFERENCES VET(ID_VET),
    FOREIGN KEY (ID_MANAGER) REFERENCES MANAGER(ID_MANAGER),
    FOREIGN KEY (ID_RACE) REFERENCES RACE(ID_RACE)
);


CREATE TABLE JOBS(
    ID_JOBS INT AUTO_INCREMENT PRIMARY KEY,
    ID_VET INT,
    ID_USER INT,
    IDENTIFICATION_PET INT, 
    JOB TEXT,    
    COSTS FLOAT(10,2),
    COST_DESCRIPTION TEXT,
    STATE ENUM('ACTIVO','FINALIZADO'),
    FOREIGN KEY (ID_VET) REFERENCES VET(ID_VET),
    FOREIGN KEY (ID_USER) REFERENCES USER(ID_USER),
    FOREIGN KEY (IDENTIFICATION_PET) REFERENCES PET(ID_PET)
);

