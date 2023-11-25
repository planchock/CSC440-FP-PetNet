CREATE TABLE IF NOT EXISTS `media` (
  `media_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_url` varchar(255) NOT NULL,
  PRIMARY KEY (`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `media_id` int(11),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK_MEDIA_ID`FOREIGN KEY (`media_id`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `follow` (
  `followee_id` int(11) unsigned NOT NULL,
  `follower_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`followee_id`, `follower_id`),
  CONSTRAINT `FK_FOLLOWEE_ID`FOREIGN KEY (`followee_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_FOLLOWER_ID`FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pet` (
  `pet_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`pet_id`),
  CONSTRAINT `FK_USER_ID`FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `group` (
  `group_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_id` int(11),
  `group_name` varchar(50),
  `group_desc` varchar(255),
  `admin_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`group_id`),
  CONSTRAINT `FK_ADMIN_ID`FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_MEDIA_ID`FOREIGN KEY (`media_id`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `group_member` (
  `group_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`),
  CONSTRAINT `FK_USER_ID`FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_GROUP_ID`FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `post` (
  `post_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_id` int(11),
  `pet_id` int(11) unsigned NOT NULL,
  `group_id` int(11),
  `text` varchar(255),
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`post_id`),
  CONSTRAINT `FK_USER_ID`FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_MEDIA_ID`FOREIGN KEY (`media_id`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PET_ID`FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_GROUP_ID`FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;