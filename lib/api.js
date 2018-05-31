const Doc = require('./doc')
const PDFGen = require('./generator')

module.exports = (api, address) => {
  //
  api.get('/:doc/page(:pagenum).html', (req, res, next) => {
    let ctx = null
    Doc.readContext(req.params.doc)
    .then(context => {
      ctx = context
      return Doc.genPage(req.params.doc, `page${req.params.pagenum}.html`, ctx)
    })
    .then(content => {
      const doc = Doc.finish([content], ctx)
      res.send(doc)
    }).catch(next)
  })

  api.get('/:doc/index.html', (req, res, next) => {
    let ctx = null
    Doc.readContext(req.params.doc)
    .then(context => {
      ctx = context
      return Doc.genPage(req.params.doc, null, ctx)
    })
    .then(contents => {
      const doc = Doc.finish(contents, ctx)
      res.send(doc)
    }).catch(next)
  })

  api.get('/:doc/render.pdf', (req, res, next) => {
    res.header('Content-Type', 'application/pdf')
    PDFGen(req.params.doc, res).then(() => res.end()).catch(next)
  })

  api.get('/:doc/static/*', (req, res, next) => {
    Doc.readStatic(req.params.doc, req.path)
    .then(content => {
      res.header('Content-Type', 'text/css')
      res.send(content)
    }).catch(next)
  })
}
