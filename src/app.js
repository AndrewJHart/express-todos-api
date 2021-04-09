// 3rd party imports
const createError = require('http-errors');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');
const app = require('express')();  // import & instantiate Express app

// Local imports
const indexRouter = require('./routes');
const predictRouter = require('./routes/todos');
const healthRouter = require('./routes/health');

// set cors headers
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // rest of request types unused in this app & are not permitted
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // intentionally set as older browsers will fail on standard 204 status
};

// enable cors middleware for all mounted routes. Can be configured per-route basis if needed
app.use(cors(corsOptions));

// configure express
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure & mount routes for express router
app.use('/', indexRouter);
app.use('/api/todos', predictRouter);
app.use('/api/health', healthRouter);

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
