CREATE TABLE IF NOT EXISTS `media` (
  `media_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_url` LONGBLOB NOT NULL,
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
  `post_count` int(11) DEFAULT 0,
  `pet_count` int(11) DEFAULT 0,
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
  `pet_id` int(11) unsigned,
  `group_id` int(11) unsigned,
  `text` TEXT NOT NULL,
  `caption` VARCHAR(255) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`post_id`),
  CONSTRAINT `FK_POSTER_USER` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_MEDIA_ID` FOREIGN KEY (`media_id`) REFERENCES `media` (`media_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PET_ID` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_POSTER_GROUP` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `comment` (
  `comment_text` varchar(255) NOT NULL,
  `post_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`comment_text`,`post_id`, `user_id`),
  CONSTRAINT `FK_COMMENTER` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_POST_ID` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER after_user_post
AFTER INSERT ON `post`
FOR EACH ROW
BEGIN
  UPDATE `user`
  SET `post_count` = `post_count` + 1
  WHERE `user_id` = NEW.`user_id`;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_user_pet_creation
AFTER INSERT ON `pet`
FOR EACH ROW
BEGIN
  UPDATE `user`
  SET `pet_count` = `pet_count` + 1
  WHERE `user_id` = NEW.`user_id`;
END;
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE create_group(
    IN p_group_name VARCHAR(255),
    IN p_group_desc TEXT,
    IN p_admin_id INT,
    IN p_group_pic LONGBLOB -- Assuming the group_pic is a BLOB type
)
BEGIN
    DECLARE pic_fk INT;
    SELECT COUNT(*) INTO @groupCount FROM petnet.group WHERE LOWER(group_name) = LOWER(p_group_name);
    IF @groupCount > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Group with the same name already exists.';
    END IF;

    IF p_group_pic IS NOT NULL THEN
        INSERT INTO media (media_url) VALUES (p_group_pic);
        SET pic_fk = LAST_INSERT_ID();
    END IF;

    INSERT INTO petnet.group (group_pic, group_name, group_desc, admin_id)
    VALUES (pic_fk, p_group_name, p_group_desc, p_admin_id);

    SET @group_id = LAST_INSERT_ID();

    INSERT INTO group_member (group_id, user_id)
    VALUES (@group_id, p_admin_id);

    SELECT @group_id AS group_id;
END 
//
DELIMITER ;

DELIMITER //

CREATE PROCEDURE create_comment (
  IN p_comment_text VARCHAR(255),
  IN p_post_id INT,
  IN p_user_id INT
)
BEGIN
  INSERT INTO comment (comment_text, post_id, user_id)
  VALUES (p_comment_text, p_post_id, p_user_id);
END //


DELIMITER ;
