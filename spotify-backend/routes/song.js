const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song =require("../models/Song");
const User = require("../models/User");

    router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
      const { name, thumbnail, track } = req.body;
      if (!name || !thumbnail || !track) {
        return res.status(403).json("Invalid credentials for song creation");
      }
      const artist = req.user._id;    
      const songDetails = { name, thumbnail, track, artist };
      try {
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong);
      } catch (error) {
        console.error("Error creating song:", error);
        next(error);
      }
    });
   
router.get("/get/mysong",passport.authenticate("jwt",{session:false}),async (req,res) => {
  const currentUser = req.user;
  const songs = await Song.find({artist:req.user._id}).populate("artist");
  return res.status(200).json({data:songs});
});

router.get("/get/artist/:artistId",passport.authenticate("jwt",{session:false}),async (req,res) => {
  const artistId = req.params.artistId;
  console.log(artistId)
  const currentArtist = await User.findOne({_id:artistId});
  if(!currentArtist){
    return res.status(200).json({err:"artist doesn,t exist"})
  }
  const songs = await Song.find({artist:artistId});
  return res.status(200).json({data:songs});
});

router.get("/get/songname/:songname",passport.authenticate("jwt",{session:false}),async (req,res) => {
  //localhost:3000/song/get/songname/one%20love (when your song name have space) or you can simply write one love because express will decode that manually
  const songName = req.params.songname;
  console.log('Received songName:', songName);
  const songs = await Song.find({name: { $regex: new RegExp(songName, 'i') }}).populate("artist");
  console.log(songs)
  if (songs === null) {
    console.error('Error finding songs:', songs);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  return res.status(200).json({data:songs});
});

module.exports =router