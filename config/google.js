import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../models/user.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    try{
        const user = await User.findOne({ googleId: profile.id });
        if(user){
            return done(null, user);
        }
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value
        });
        await newUser.save();
        return done(null, newUser);
    }catch(error){
        return done(error, null);
    }
  }
));
