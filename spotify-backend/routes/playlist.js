const express = require("express")
const passport =require("passport");
const Playlist =require("../models/Playlist")
const User =require("../models/User")
const Song =require("../models/Song")
const router = express.Router();

router.post("/create",passport.authenticate("jwt",{session:false}),async (req,res) => {
    const currentUser =req.user;
    const {name,thumbnail,songs} = req.body;
    if(!name || !thumbnail || !songs){
        return res.status(400).json({err:"invalid credentials"})
    }
    const playlistData ={name,thumbnail,songs,owner:currentUser._id,}
    const createdPlalist = await Playlist.create(playlistData);
    return res.status(200).json(createdPlalist)
})

router.get("/get/myplaylist",passport.authenticate("jwt",{session:false}),async (req,res) => {
    const playlistId = req.user._id;
    const playlist = await Playlist.find({owner:playlistId}).populate("owner");
    if(!playlist){
        return res.status(400).json({err:"Invalid ID"})
    }
    return res.status(200).json(playlist);
})

router.get("/get/playlistid/:playlistId",passport.authenticate("jwt",{session:false}),async (req,res) => {
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findOne({_id:playlistId}).populate({path:"songs",populate:{path:"artist"}});
    if(!playlist){
        return res.status(400).json({err:"Invalid ID"})
    }
    return res.status(200).json(playlist);
})

router.get("/get/artistid/:artistId",passport.authenticate("jwt",{session:false}),async (req,res) => {
    const artistId = req.params.artistId;
    const currentArtist = await User.findOne({_id:artistId})
    if(!currentArtist){
        return res.status(403).json({err:"artist doesn't exist"})
    }
    const playlist = await Playlist.find({owner:artistId});
    return res.status(200).json(playlist);
})

router.post("/add/song",passport.authenticate("jwt",{session:false}),async (req,res) => {
    const currentUser = req.user;
    const {playlistId,songId}=req.body
    const playlist = await Playlist.findOne({_id:playlistId})
    if(!playlist){
        return res.status(400).json({err:"playlist doesn,t exist"});  
    }
    if(!playlist.owner.equals(currentUser._id) &&
        !playlist.collaborators.includes(currentUser._id)){
            return res.status(400).json({err:"not allowed"});
        }
    const song = await Song.findOne({_id:songId})
    if(!song){
        return res.status(400).json({err:"song does not exist"})
    }
    playlist.songs.push(songId)
    await playlist.save()
    return res.status(200).json(playlist);
})

module.exports =router