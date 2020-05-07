const jwt = require('jsonwebtoken');

const { TOKEN_SECRET } = process.env;

const checkTokenSetUser = (req, res, next) => {
  try {
    // get token from frontend, from authorization header
    const authHeader = req.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
				const decoded = jwt.verify(token, TOKEN_SECRET);
				console.log('decoded', decoded)
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedIn = (req, res, next) => {
  // if req.user is set, move along, it means the user is logged in
  // else send unathorized error
  try {
    if (req.user) {
      next();
    } else {
      res.status(401);
      throw Error('Unauthorized.');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
};
