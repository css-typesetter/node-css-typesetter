const Doc = require('./doc')

module.exports = (api) => {
  //
  api.get('/page(:pagenum).html', (req, res, next) => {
    let ctx = null
    Doc.readContext()
    .then(context => {
      ctx = context
      return Doc.genPage(req.params.pagenum, ctx)
    })
    .then(content => {
      const doc = Doc.finish([content], ctx)
      res.send(doc)
    }).catch(next)
  })

  api.get('/index.html', (req, res, next) => {
    let ctx = null
    Doc.readContext()
    .then(context => {
      ctx = context
      return Doc.genPage(null, ctx)
    })
    .then(contents => {
      const doc = Doc.finish(contents, ctx)
      res.send(doc)
    }).catch(next)
  })

  api.get('/static/*', (req, res, next) => {
    Doc.readStatic(req.path)
    .then(content => {
      res.header('Content-Type', 'text/css')
      res.send(content)
    }).catch(next)
  })
}
