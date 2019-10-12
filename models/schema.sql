DROP DATABASE IF EXISTS schedule_db;
CREATE DATABASE schedule_db;
-- USE schedule_db;

-- sequelize user has many events
-- sequelize user has many invites
CREATE TABLE users
(
	userId int NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	PRIMARY KEY (userId)
);
-- sequelize event belongs to one user
-- sequelize event has many invites
CREATE TABLE events
(
	eventId int NOT NULL AUTO_INCREMENT,
	-- use alias to call it owner (userId)
	userId int NOT NULL,
	eventTitle VARCHAR(255) NOT NULL,
	startTime DATETIME NOT NULL,
	endTime DATETIME NOT NULL,
	eventDate DATE NOT NULL,
	PRIMARY KEY (eventId)
);
-- sequelize invite belongs to one event/user
CREATE TABLE invites
(
	inviteId int NOT NULL AUTO_INCREMENT,
	eventId int NOT NULL,
	userId int NOT NULL,
	PRIMARY KEY(inviteId)
)
