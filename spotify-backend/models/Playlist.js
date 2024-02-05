const mongoose = require("mongoose");
const { Schema } = mongoose;

const Playlist = new Schema({
     name: {
        type: String,
        required: true,
     },
     thumbnail: {
        type: String,
        required: true,
     },
     owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
     },
     songs: [{
        type: mongoose.Types.ObjectId,
        ref: "Song"
     }],
     collaborators: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
     }]
     
     
})

const PlaylistModel = mongoose.model('Playlist', Playlist);

module.exports =PlaylistModel;