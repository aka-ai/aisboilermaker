const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const db = require('./db')
const PORT = process.env.PORT || 3000
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStorage.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

//passport registration
passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (err) {
    done(err)
  }
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// configure and create our database store
const dbStore = new SequelizeStore({db: db})

// sync so that our session table gets created
dbStore.sync()

// you'll of course want static middleware so your browser can request things like your 'bundle.js'
app.use(express.static(path.join(__dirname, '../public')))

app.use(morgan('dev'))

// Any routes or other various middlewares should go here!
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret string',
    // plug the store into our session middleware
    store: dbStore,
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api', require('./api'))
// Make sure this is right at the end of your server logic!
// The only thing after this might be a piece of middleware to serve up 500 errors for server problems
// (However, if you have middleware to serve up 404s, that go would before this as well)
app.get('*', function(req, res, next) {
  try {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  } catch (err) {
    next(err)
  }
})

app.use(function(err, req, res, next) {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
db.sync().then(function() {
  app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
  })
})
