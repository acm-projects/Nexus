import jwt from 'jsonwebtoken';
import { dynamodb } from '../utils/awsConfig.js';

const JWT_CONFIG = {
    accessTokenSecret: 'urmummy', // Keep your existing secret for now
    refreshTokenSecret: 'urmummy', // Use same secret for consistency
    accessTokenExpiry: '1h',
    refreshTokenExpiry: '7d'
  };
  
  export const generateTokens = async (userId) => {
    try {
      const params = {
        TableName: 'OnboardingDB',
        Key: {
          userId: userId
        }
      };
  
      const userData = await dynamodb.get(params).promise();
      console.log('User data fetched:', userData);

      const username = userData.Item?.username;
  
      if (!username) {
        throw new Error('Username not found for user');
      }
  
      const accessToken = jwt.sign(
        { userId, username },
        JWT_CONFIG.accessTokenSecret,
        { expiresIn: JWT_CONFIG.accessTokenExpiry }
      );
  
      const refreshToken = jwt.sign(
        { userId, username },
        JWT_CONFIG.refreshTokenSecret,
        { expiresIn: JWT_CONFIG.refreshTokenExpiry }
      );

      console.log('Generated tokens:', { accessToken, refreshToken });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw error; // Make sure to throw the error instead of silently catching it
    }
  };
  
  export const verifyToken = (token) => {
    if (!token) {
      throw new Error('Token is required');
    }
  
    // Remove 'Bearer ' if present
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    return jwt.verify(tokenString, JWT_CONFIG.accessTokenSecret);
  };
  
  export const authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
      }
  
      const decoded = verifyToken(token);
      
      const params = {
        TableName: 'UserDB',
        Key: {
          userId: decoded.userId
        }
      };
  
      const user = await dynamodb.get(params).promise();
      
      if (!user.Item) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = {
        userId: decoded.userId,
        username: decoded.username
      };
  
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      console.error('Auth error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const verifySocketToken = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
  
      const decoded = verifyToken(token);
      
      const params = {
        TableName: 'UserDB',
        Key: {
          userId: decoded.userId
        }
      };
  
      const user = await dynamodb.get(params).promise();
      
      if (!user.Item) {
        return next(new Error('User not found'));
      }
  
      socket.userId = decoded.userId;
      socket.user = user.Item;
      
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  };
  
  export const checkTokenContents = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.accessTokenSecret);
      return {
        hasUsername: !!decoded.username,
        contents: decoded
      };
    } catch (error) {
      return {
        hasUsername: false,
        error: error.message
      };
    }
  };