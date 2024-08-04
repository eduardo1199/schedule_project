const express = require('express');

require('dotenv').config()

const path = require('path');
const helmet = require('helmet')

const route = require('./routes');
const { default: mongoose } = require('mongoose');

const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { checkNotFoundPage,middlewareGlobal }  = require('./src/middleware/middleware')

const app = express();

mongoose.connect(process.env.CONNECT_LINK_DATABASE).then(() => {
  app.emit('finished');
  console.log("Connect database sucessfully!")
}).catch(() => {
  console.log("Connect database failed!")
})

const sessionOptions = session({
  secret: 'LASKNSXOSnoifneifubndiOINHnolenfeoisn',
  store: MongoStore.create({
    mongoUrl: process.env.CONNECT_LINK_DATABASE
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())
app.use(helmet())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(checkNotFoundPage)
app.use(middlewareGlobal)

app.use(route)

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs')

app.on('finished', () => {
  app.listen(8080, () => {
    console.log('server listening on port 8080!')
  });
})