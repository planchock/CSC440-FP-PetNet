const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");


router.get("/pets", auth, (req, res) => {
    const userId = req.user.user_id;
    db.query(
        'SELECT pet_id, name FROM pet WHERE user_id = ?', [userId]
    ).then(results => {
        const data = results.results.map(item => item);
        return res.status(200).json(data);
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
    });
});

router.post("/pets", auth, (req, res) => {
    const userId = req.user.user_id;
    const pet = req.body.pet;
    db.query(
        `INSERT INTO pet (name, type, user_id, birthday, bio) VALUES (?, ?, ?, ?, ?)`, 
        [pet.name, pet.type, userId, pet.birthday, pet.bio]
    ).then(results => {
        const data = results.results;
        return res.status(200).json(data);
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
    });
});

router.put("/pets/:petId", auth, (req, res) => {
    const userId = req.user.user_id;
    const pet = req.body.pet;
    const petId = req.params.petId;

    db.query(
        `UPDATE pet SET name = ?, type = ?, birthday = ?, bio = ? WHERE pet_id = ? AND user_id = ?`,
        [pet.name, pet.type, pet.birthday, pet.bio, petId, userId]
    ).then(results => {
        const data = results.results;
        if (data.affectedRows === 0) {
            //pet does not exist
            return res.status(404).json({ msg: "Pet not found" });
        }

        return res.status(200).json({ msg: "Pet updated successfully" });
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
    });
});

module.exports = router;