import passport from 'passport';

export const authenticate = passport.authenticate('local', { session: true });

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
