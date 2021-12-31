var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileupload = require('express-fileupload')

require('dotenv').config();
var session = require('express-session');

var indexRouter = require('./routes/index');
var destinosRouter = require('./routes/destinos');
var hotelesRouter = require('./routes/hoteles'); 
var transporteRouter = require('./routes/transportes'); 
var experienciasRouter = require('./routes/experiencias'); 
var contactoRouter = require('./routes/contacto'); 
var loginRouter = require('./routes/admin/login'); 
var adminDestinosRouter = require('./routes/admin/Destinos');
const fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '01234567899876543210',
  resave: false,
  saveUninitialized: true,
  //cookie: {maxAge: 60000}
}))

secured = async function (req, res, next) {
  try {
    console.log(req.session.id_usuario);

    if (req.session.id_usuario) {
      next()
    } else {
      res.redirect('/admin/login')
    }
  } catch (error) {
    console.log(error)
  }
} 

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
})); 

app.use('/', indexRouter);
app.use('/destinos', destinosRouter);
app.use('/hoteles', hotelesRouter);
app.use('/experiencias', experienciasRouter);
app.use('/transportes', transporteRouter);
app.use('/contacto', contactoRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/destinos', secured, adminDestinosRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;