const Doc = require('./doc')
const DB = require('./db')
const PDFGen = require('./generator')
const _ = require('underscore')

module.exports = (api, address) => {
  //
  api.get('/:doc/page(:pagenum).html', (req, res, next) => {
    Doc.genPage(req.params.doc, `page${req.params.pagenum}.html`, req.query.d)
    .then(doc => {
      res.send(doc)
    }).catch(next)
  })

  api.get('/:doc/index.html', (req, res, next) => {
    Doc.genPage(req.params.doc, null, req.query.d).then(doc => {
      res.send(doc)
    }).catch(next)
  })

  api.get('/:doc/render(:pagenum?).pdf', (req, res, next) => {
    res.header('Content-Type', 'application/pdf')
    Doc.readContext(req.params.doc)
    .then(ctx => {
      return Doc.readLinkedDocs(ctx)
    })
    .then(ctx => {
      return PDFGen(req.params.doc, req.params.pagenum, res, ctx)
    })
    .then(() => res.end())
    .catch(next)
  })

  api.get('/:doc/static/*', (req, res, next) => {
    DB.getContent(req.params.doc, `static/${req.params['0']}`).then(content => {
      res.header('Content-Type', 'text/css')
      res.send(content)
    }).catch(next)
  })

  api.get('/:doc', (req, res, next) => {
    Promise.all([
      Doc.readContext(req.params.doc).then(ctx => {
        return _.map(ctx, (val, key) => ({val, key}))
      }),
      Doc.getAllPagesContent(req.params.doc)
    ]).then(fetched => {
      return res.json(fetched)
    }).catch(next)
  })

  // modification API

  api.post('/:doc', (req, res, next) => {
    DB.createDir(req.params.doc).then(() => res.end()).catch(next)
  })

  api.post('/:doc/page', (req, res, next) => {
    Doc.findNexPageNum(req.params.doc)
    .then(num => {
      return DB.createFile(req.params.doc, `page${num}.html`, req.body.content)
    })
    .then(() => res.end())
    .catch(next)
  })
  api.put('/:doc/page/:num', (req, res, next) => {
    DB.updateFile(req.params.doc, `page${req.params.num}.html`, req.body.content)
    .then(() => res.end())
    .catch(next)
  })

  api.put('/:doc/style', (req, res, next) => {
    DB.updateFile(req.params.doc, `static/style.css`, req.body.content)
    .then(() => res.end())
    .catch(next)
  })

  api.put('/:doc/context', (req, res, next) => {
    const ctx = _.reduce(req.body, (acc, i) => {
      acc[i.key] = i.val
      return acc
    }, {})
    DB.updateFile(req.params.doc, 'context.json', JSON.stringify(ctx, null, 2))
    .then(() => res.end()).catch(next)
  })
}
