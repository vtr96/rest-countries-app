const mongoose = require('mongoose');

const FavoriteCountrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    code: String,
    flag: String,
    region: String,
    createdAt: { type: Date, default: Date.now },
}, {
    versionKey: false
});

module.exports = mongoose.model('FavoriteCountry', FavoriteCountrySchema);