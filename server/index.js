const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
// you'll of course want static middleware so your browser can request things like your 'bundle.js'
app.use(express.static(path.join(__dirname, '../public')))

app.use(morgan('dev'))

// Any routes or other various middlewares should go here!
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', require('./api'))
// Make sure this is right at the end of your server logic!
// The only thing after this might be a piece of middleware to serve up 500 errors for server problems
// (However, if you have middleware to serve up 404s, that go would before this as well)
app.get('*', function(req, res, next) {
  try {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  } catch(err) {
    next(err)
  }
})

app.use(function (err, req, res, next) {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}` )
})