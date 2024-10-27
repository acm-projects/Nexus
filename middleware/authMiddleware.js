import jwt from 'jsonwebtoken';
import { dynamodb } from '../utils/awsConfig.js';

const JWT_SECRET = 'urmummy'; 

export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if user exists in database
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

        // Attach user info to request
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

export const verifyToken = (token) => {
  if (!token) {
      throw new Error('Token is required');
  }

  try {
      // Remove 'Bearer ' if present
      const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Verify and decode token
      const decoded = jwt.verify(tokenString, JWT_SECRET);
      
      return decoded;
  } catch (error) {
      throw new Error('Invalid token');
  }
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
        const username = userData.Item?.username;

        if (!username) {
            throw new Error('Username not found for user');
        }

        // Include username in token payload
        const accessToken = jwt.sign(
            { 
                userId,
                username 
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { 
                userId,
                username
            }, 
            'refreshSecret', 
            { expiresIn: '7d' }
        );

       // console.log("Generated AccessToken: ",accessToken); 
       // console.log("Generated refreshToken: ",refreshToken);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generating tokens:', error);
        //throw error;
    }
};


// Optional: Refresh token functionality
export const generateRefreshToken = (userId) => {
  return jwt.sign(
      { userId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' } // Refresh token expires in 7 days
  );
};

export const verifySocketToken = async (socket, next) => {
  try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
          return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      
      // Check if user exists in database
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

      // Attach user info to socket
      socket.userId = decoded.userId;
      socket.user = user.Item;
      
      next();
  } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
  }
};

// Example of how to use refresh tokens
export const refreshAccessToken = async (refreshToken) => {
  try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
          throw new Error('Invalid token type');
      }

      // Check if user exists
      const params = {
          TableName: 'UserDB',
          Key: {
              userId: decoded.userId
          }
      };

      const user = await dynamodb.get(params).promise();
      
      if (!user.Item) {
          throw new Error('User not found');
      }

      // Generate new access token
      return await generateToken(decoded.userId);
  } catch (error) {
      throw new Error('Invalid refresh token');
  }
};

export const checkTokenContents = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
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