CREATE TABLE IF NOT EXISTS `media` (
  `media_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_url` varchar(255) NOT NULL,
  PRIMARY KEY (`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` TEXT NOT NULL,
  `salt` TEXT NOT NULL,
  `profile_pic` int(11) unsigned,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK_PROFILE_PIC` FOREIGN KEY (`profile_pic`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `follow` (
  `followee_id` int(11) unsigned NOT NULL,
  `follower_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`followee_id`, `follower_id`),
  CONSTRAINT `FK_FOLLOWEE_ID` FOREIGN KEY (`followee_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_FOLLOWER_ID` FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pet` (
  `pet_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`pet_id`),
  CONSTRAINT `FK_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `group` (
  `group_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_pic` int(11) unsigned,
  `group_name` varchar(50),
  `group_desc` varchar(255),
  `admin_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`group_id`),
  CONSTRAINT `FK_ADMIN_ID` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_GROUP_PIC` FOREIGN KEY (`group_pic`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `group_member` (
  `group_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`),
  CONSTRAINT `FK_USER_ASSOCIATED` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_GROUP_ID` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `post` (
  `post_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_id` int(11) unsigned,
  `pet_id` int(11) unsigned NOT NULL,
  `group_id` int(11) unsigned,
  `text` varchar(255),
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`post_id`),
  CONSTRAINT `FK_POSTER_USER` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_MEDIA_ID` FOREIGN KEY (`media_id`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PET_ID` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_POSTER_GROUP` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Inserting media records
INSERT INTO `media` (`media_url`) VALUES
  ('https://example.com/user1_profile_pic.jpg'),
  ('https://example.com/user2_profile_pic.jpg'),
  ('https://example.com/group_pic.jpg'),
  ('https://example.com/pet1_pic.jpg'),
  ('https://example.com/pet2_pic.jpg');

-- Inserting user records
INSERT INTO `user` (`first_name`, `last_name`, `username`, `password`, `salt`, `profile_pic`) VALUES
  ('John', 'Doe', 'john_doe', 'hashed_password1', 'salt1', 1),
  ('Jane', 'Smith', 'jane_smith', 'hashed_password2', 'salt2', 2);

-- Inserting follow relationship
INSERT INTO `follow` (`followee_id`, `follower_id`) VALUES
  (1, 2);

-- Inserting group record
INSERT INTO `group` (`group_pic`, `group_name`, `group_desc`, `admin_id`) VALUES
  (3, 'Cool Group', 'A group for cool people', 1);

-- Inserting group members
INSERT INTO `group_member` (`group_id`, `user_id`) VALUES
  (1, 1),
  (1, 2);

-- Inserting pet records
INSERT INTO `pet` (`name`, `type`, `user_id`) VALUES
  ('Buddy', 'Dog', 1),
  ('Whiskers', 'Cat', 2);

-- Inserting post records
INSERT INTO `post` (`media_id`, `pet_id`, `group_id`, `text`, `user_id`) VALUES
  (4, 1, 1, 'Just adopted a new furry friend!', 1),
  (NULL, 2, NULL, 'Meet my cute kitty, Whiskers!', 2),
  (5, 1, NULL, 'Enjoying a walk with Buddy in the park.', 1),
  (NULL, 2, NULL, 'Whiskers sleeping peacefully.', 2);