const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const jwt = require("jsonwebtoken");

const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash });
        await user.save();
        res.status(201).send({ message: "successfull register" });
    } catch (error) {
        res.status(500).json({ message: "error register", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("user not found");
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).send("invalid password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "error login", error: error.message });
    }
});

router.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).send("refresh token not found");
    }

    jwt.verify(refreshToken, refreshSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user);
        res.json({ accessToken: accessToken });
    });
});

module.exports = router;