const express = require('express');
const path = require('path');
const glob = require('glob');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const setupGraphQL = require('./graphQLSetup');
const { createToken, verifyToken } = require('./auth');
const { refreshTokens } = require('./auth')

const addUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }

  try {
    const { user } = jwt.verify(token, process.env.SECRET);
    req.user = user;
  } catch (err) {
    const refreshToken = req.cookies['refresh-token'];

    console.log(refreshToken)
    if (!refreshToken) {
      return next();
    }

    const newTokens = await refreshTokens(token, refreshToken, process.env.SECRET, process.env.SECRET_2);
    if (newTokens.token && newTokens.refreshToken) {
      res.cookie('token', newTokens.token, { maxAge: 60 * 60 * 24 * 7,
        // httpOnly: true
      });
      res.cookie('refresh-token', newTokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        // httpOnly: true,
      });
    }
    req.user = newTokens.user;
  }
  return next();
};


const whitelist = [
  'http://localhost:3000',
  'http://localhost:4000',
];

module.exports = function(app) {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
        // console.log('error: CORS problem!')
        // callback(new Error('Not allowed by CORS'));
      }
    },
    credentials : true
  };

  app.use(cors(corsOptions));

  app.set('view engine', 'ejs');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  app.use(addUser);

  setupGraphQL(app);

  // var controllers = glob.sync(path.normalize(__dirname + '/..') + '/app/controllers/*.js');
  // controllers.forEach(function (controller) {
  //   require(controller)(app);
  // });

  // app.use(express.static('build'));

  // app.get('*', (req, res) => {
  //   return res.sendFile(path.join(__dirname, '../build', 'index.html'));
  // });

  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
