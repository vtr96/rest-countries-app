const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const authMiddleware = require('./middleware/authMiddleware');
const FavoriteCountry = require('../models/FavoriteCountry');



router.post('/favorites', authMiddleware, async (req, res) => {
    try {
        const { name, code, flag, region } = req.body;
        const userId = req.userId;

        const existing = await FavoriteCountry.findOne({ user: userId, code });
        if (existing) {
            return res.status(409).json({ message: 'Already in favorites.' });
        }

        const newFav = new FavoriteCountry({ user: userId, name, code, flag, region });
        await newFav.save();

        res.status(201).json({ message: 'Favorite saved successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving favorite.', error: err.message });
    }
});


router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const favorites = await FavoriteCountry.find({ user: userId });
        res.status(200).json(favorites);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar favoritos.', error: err.message });
    }
});

router.delete('/favorites/:code', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { code } = req.params;

        const deleted = await FavoriteCountry.findOneAndDelete({ user: userId, code });

        if (!deleted) {
            return res.status(404).json({ message: 'Not found in favorites.' });
        }

        res.status(200).json({ message: 'Favorite removed.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting favorite.', error: err.message });
    }
});

module.exports = router;