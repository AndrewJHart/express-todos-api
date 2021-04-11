// 3rd party imports
const createError = require('http-errors');
const bodyParser = require('body-parser')
const boolParser = require('express-query-boolean');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const getUser = require('./helpers/users').getUser;
const app = require('express')();  // import & instantiate Express app
require('dotenv').config();

// Local imports
const indexRouter = require('./routes');
const todosRouter = require('./routes/todos');
const usersRouter = require('./routes/users');
const healthRouter = require('./routes/health');

// jwt, cache passport props for easier readability
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
};

// set cors headers
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // rest of request types unused in this app & are not permitted
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // intentionally set as older browsers will fail on standard 204 status
};

// configure passport & auth strategy
passport.use(
    new JwtStrategy(jwtOptions, async (req, jwtPayload, next) => {
      let user = await getUser(jwtPayload.id);

      if (!user) {
          next(null, false)
      }

      req.user = user;
      next(null, user);
    })
);

// enable passport on app
app.use(passport.initialize({}));

// enable cors middleware for all mounted routes. Can be configured per-route basis if needed
app.use(cors(corsOptions));

// configure express
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(boolParser());


// configure & mount routes for express router
app.use('/', indexRouter);
app.use('/api/todos', todosRouter);
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);

// middleware catch 404 & forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ msg: `${err.status || 500} Endpoint not found or server error` });
});

module.exports = app;
