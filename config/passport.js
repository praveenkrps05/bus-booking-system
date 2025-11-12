import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          if (!user.verified) {
            return done(null, false, { message: 'Please verify your email first' });
          }

          const isMatch = await user.comparePassword(password);
          
          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default configurePassport;
