const express = require('express')
const bodyParser = require('body-parser')
const Api = require('./lib/api')

module.exports = (app, sendMail) => {
  // JSON body parser for parsing incoming data
  app.use(bodyParser.json({limit: '10mb'}))

  const api = express()
  Api(api)
  app.use(api)

  function _generalErrorHandler (err, req, res, next) {
    if (err.code === 'ENOENT') {
      return res.status(404).send('nothing here')
    }
    res.status(err.status || 400).send(err.message || err)
    if (process.env.NODE_ENV !== 'production') {
      console.log('---------------------------------------------------------')
      console.log(err)
      console.log('---------------------------------------------------------')
    }
  }
  app.use(_generalErrorHandler)
  return app
}
