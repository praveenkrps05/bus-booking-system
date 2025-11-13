import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-jwt-secret', {
    expiresIn: '30d',
  });
};

export default generateToken;
