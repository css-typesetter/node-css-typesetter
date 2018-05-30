const Doc = require('./doc')

api.get(':pagenum/', (req, res, next) => {
  Doc.readContext()
  .then(context => {
    return Doc.genPage(req.params.pagenum, context)
  })
  .then(content => {
    res.send(content)
  }).catch(next)
})
