
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const db = require('./models')

const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    { user: _.pick(user, ['ID'])},
    secret,
    { expiresIn: '1m' },
  );

  const createRefreshToken = jwt.sign(
    { user: _.pick(user, 'ID') },
    secret2,
    { expiresIn: '7d' }
  );

  return Promise.all([createToken, createRefreshToken]);
};

const refreshTokens = async (token, refreshToken, SECRET, SECRET_2) => {
  let userId = -1;
  try {
    const { user: { ID } } = jwt.decode(refreshToken);
    userId = ID;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await db.User.findOne({ where: { ID: userId }, raw: true });

  if (!user) {
    return {};
  }

  // const refreshSecret = SECRET_2 + user.password;
  const refreshSecret = SECRET_2;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

const tryLogin = async (email, password, SECRET, SECRET_2) => {
  const user = await db.User.findOne({ where: { user_email: email }, raw: true });
  if (!user) {
    // user with provided email not found
    throw new Error('Invalid login');
  }

  // const valid = await bcrypt.compare(password, user.display_name);
  const valid = password === process.env.TEMP_PWD;
  if (!valid) {
    // bad password
    throw new Error('Invalid password');
  }

  // const [token, refreshToken] = await createTokens(user, SECRET, SECRET_2 + user.password);
  const [token, refreshToken] = await createTokens(user, SECRET, SECRET_2);

  return {
    token,
    refreshToken,
  };
};

module.exports = {
  createTokens,
  refreshTokens,
  tryLogin
}
















// const expiresIn = '3h' // time to live
// const secret = 'samplejwtauthgraphql' // secret key
// const tokenPrefix = 'JWT' // Prefix for HTTP header

// const verifyToken = (token) => {
//   const [prefix, payload] = token.split(' ')
//   let user = null
//   if (!payload) { //no token in the header
//       throw new Error('No token provided')
//   }
//   if (prefix !== tokenPrefix) { //unexpected prefix or format
//       throw new Error('Invalid header format')
//   }
//   jwt.verify(payload, secret, (err, data) => {
//       if (err) { //token is invalid
//           throw new Error('Invalid token!')
//       } else {
//           user = find(Users, { email: data.username })
//       }
//   })
//   if (!user) { //user does not exist in DB
//       throw new Error('User doesn not exist')
//   }
//   return user
// }

// const createToken = (email, password) => {
//   if (!email || !password) { // no credentials = fail
//       return false
//   }
//   const user = find(Users,
//       (user) => {
//           return user.email === email.toLowerCase()
//               && user.last_name.toLowerCase() === password
//       }
//   );
//   if (!user) { // return false if not found
//       return false
//   }
//   const payload = {
//       username: user.email,
//   }
//   const token = jwt.sign(payload, secret, {
//       expiresIn
//   })
//   return token
// }

// module.exports = {
//   verifyToken,
//   createToken
// }
