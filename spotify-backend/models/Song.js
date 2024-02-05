const mongoose = require("mongoose");
const {Schema} =mongoose;

const Song = new Schema({
     name: {
        type: String,
        required: true,
     },
     thumbnail: {
        type: String,
        required: true,
     },
     track: {
        type: String,
        required: true,
     },
     artist: {
        type: mongoose.Types.ObjectId,
        ref: "User",
     }
})

const SongModel = mongoose.model('Song', Song);

module.exports =SongModel;