DROP DATABASE IF EXISTS `lottery_firecompass`;

CREATE DATABASE IF NOT EXISTS `lottery_firecompass`;
USE lottery_firecompass;

DROP TABLE IF EXISTS `Lobby`;

CREATE TABLE IF NOT EXISTS `Lobby` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lobby_name` varchar(255) DEFAULT NULL,
  `lobby_total_member_alloted_seats` int DEFAULT 0,
  `entry_fee_per_seat` int DEFAULT 0,
  `lobby_status` tinyint(1) DEFAULT 0,
  `draw_date` datetime,
  `created` datetime,
  PRIMARY KEY (`id`)
)ENGINE=INNODB;

DROP TABLE IF EXISTS `Tickets`;

CREATE TABLE IF NOT EXISTS `Tickets` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lobby_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cost` int DEFAULT 0,
  `sold` tinyint(1) DEFAULT 0,
  `purchase_date` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`lobby_id`) REFERENCES `Lobby` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;


DROP TABLE IF EXISTS `Members`;

CREATE TABLE IF NOT EXISTS `Members` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `balance` int DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `Tickets` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;

DROP TABLE IF EXISTS `Winners`;

CREATE TABLE IF NOT EXISTS `Winners` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` int DEFAULT 0,
  `paid` int DEFAULT 0,
  `claimed` int DEFAULT 0,
  `draw_date` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `Tickets` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;

DROP TABLE IF EXISTS `Stats`;

CREATE TABLE IF NOT EXISTS `Stats` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lobby_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cuts` int DEFAULT 0,
  `draw_date` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `Tickets` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;

/* DUMP INSerstion */

INSERT INTO Lobby (`id`, `lobby_name`, `lobby_total_member_alloted_seats`, `entry_fee_per_seat`, `created`) VALUES ('dhjo7x0358-kjy50baw-12923355503584144-e8tqy2crdkjy50baw', 'Code_Monk', 20, 150, now());
INSERT INTO Lobby (`id`, `lobby_name`, `lobby_total_member_alloted_seats`, `entry_fee_per_seat`, `created`) VALUES ('dhjo7x0358-kjy50baw-sdfw3esdsfwer-e8tqy2crdkjy50baw', 'Firecompass_Monk', 20, 350, now());
INSERT INTO Lobby (`id`, `lobby_name`, `lobby_total_member_alloted_seats`, `entry_fee_per_seat`, `created`) VALUES ('dhjo7x0358-23dw4r2-sdfw3esdsfwer-e8tqy2crdkjy50baw', 'HackerEarth_Monk', 20, 550, now());