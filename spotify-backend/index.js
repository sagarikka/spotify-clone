const express= require("express");
require('dotenv').config();
const  mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport")
const cors = require("cors");
const User =require("./models/User")
const authRoutes = require("./routes/auth")
const songRoutes = require("./routes/song")
const playlistRoutes = require("./routes/playlist")
const app =express();

app.use(express.json())
app.use(cors());
app.use(passport.initialize());

mongoose.connect("mongodb+srv://sagarikasl446:"+process.env.MONGO_PASSWORD+"@sagarika.cpdxozy.mongodb.net/spotifyDB")
.then((x) => {
console.log("Connected to Mongo!");
})
.catch((err) => {
console.log("Error while connecting to Mongo");
}); 
//?retryWrites=true&w=majority
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'thisKeyIsSupposedToBeSecret';
passport.use(new JwtStrategy(opts,  function(jwt_payload, done) {
    console.log(jwt_payload)
   User.findOne({_id: jwt_payload.identifier}).maxTimeMS(30000).then(function(user,err) {
    if (err) {
        console.error('Error finding user:', err);
        return done(err, false);
      }
  
      if (user) {
        console.log('User found:', user);
        return done(null, user);
      } else {
        console.log('User not found');
        return done(null, false);
      }
    })
}));



app.get("/",(req,res) => {
    res.send('successful response')
})

app.use("/auth",authRoutes)
app.use("/song",songRoutes)
app.use("/playlist",playlistRoutes)

  app.use((err, req, res, next) => {
    console.log('User:', req.user); 
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
  });
  

app.listen(3030,() => console.log('server is listening on port 3030'))