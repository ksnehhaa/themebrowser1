//middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ This is the key fix!
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
// This middleware checks for a valid JWT token in the request headers.
// If the token is valid, it decodes the user information and attaches it to the request object.
// If the token is missing or invalid, it responds with a 401 Unauthorized status and an error message.
// This is useful for protecting routes that require authentication, ensuring that only logged-in users can access them.
// This middleware is used to verify JWT tokens in incoming requests.
// It checks for the presence of a token in the Authorization header, verifies it, and attaches the user information to the request object if valid.
