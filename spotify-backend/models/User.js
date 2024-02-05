const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
     firstName:{
        type : String,
        required : true,
     },
     password:{
      type : String,
      required : true,
      private : true
   },
     lastName :{
        type : String,
        required : false,
     },
     email :{
        type : String,
        required : true,
     },
     userName :{
        type : String,
        required : true,
     },
     likedSong :{
        type : String,
        default: "",
     },
     likedPlayList :{
        type : String,
        default: "",
     },
     subscribedArtist :{
        type : String,
        default: "",
     }
})

const UserModel = mongoose.model('User', User);

module.exports =UserModel;