const DB = require('./db')
const Handlebars = require('handlebars')
const _ = require('underscore')
const axios = require('axios')
const marked = require('marked')

Handlebars.registerHelper('PART', (content) => {
  return new Handlebars.SafeString(content)
})

function finish (pages, context, debug) {
  const debugstyle = debug ? `
    <style>
    .page {border: 1px dotted red};
    .inner {border: 1px dotted grey;}
    </style>
  ` : ''
  const extrasstyle = context.extrasstyle ? context.extrasstyle.reduce((acc, i) => {
    return acc + `<link rel="stylesheet" href="${i}"/>\n`
  }, '') : ''
  return `
<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css">
    ${extrasstyle}
    <style>
    .page {
      display: block;
      width: ${context.width}cm;
      height: ${context.height}cm !important;
      overflow: hidden;
    }
    .inner {
      margin: ${context.margin}cm;
      height: ${Number(context.height) - (2 * Number(context.margin))}cm;
      position: relative;
    }
    </style>
    <link rel="stylesheet" href="static/style.css">
    ${debugstyle}
  </head>
  <body>
  ${pages.reduce((acc, i) => (acc + `<div class="page"><div class="inner">${i}</div></div>\n`), '')}
  </body>
</html>`
}

function _getGDocContent (docId, key, ctx) {
  const APIKEY = process.env.GOOGLE_API_KEY
  const APIURL = 'https://www.googleapis.com/drive/v3'
  return axios.get(`${APIURL}/files/${docId}/export?key=${APIKEY}&mimeType=text/plain`)
  .then(res => {
    ctx[key] = marked(res.data)
  })
  .catch(err => {
    ctx[key] = JSON.stringify(err.response.data)
  })
}

function _wait4google (promises, ctx) {
  return Promise.all(promises).then(() => {
    return ctx
  })
}

function readContext (doc) {
  return DB.getContent(doc, 'context.json')
  .then(content => {
    const ctx = JSON.parse(content)
    ctx.width = ctx.width || '21'
    ctx.height = ctx.height || '29.7'
    ctx.margin = ctx.margin || '.4'
    const gDocPromises = []
    _.filter(ctx, (v, k) => {
      const m = v.match(/google:(.*)/)
      if (m) {
        gDocPromises.push(_getGDocContent(m[1], k, ctx))
      }
    })
    return gDocPromises.length > 0 ? _wait4google(gDocPromises, ctx) : ctx
  })
}
exports.readContext = readContext

function getAllPages (doc) {
  return DB.listFolder(doc).then(dircontent => {
    const pages = dircontent.filter(i => i.match(/page([0-9]+).html/))
    return pages
  })
}

function findNexPageNum (doc) {
  return getAllPages(doc).then(pages => {
    let num = 1
    while (true) {
      const exists = pages.find(i => i === `page${num}.html`)
      if (!exists) return num
      num++
    }
  })
}
exports.findNexPageNum = findNexPageNum

function getAllPagesContent (doc) {
  return getAllPages(doc).then(pages => {
    return Promise.all(pages.map(i => DB.getContent(doc, i)))
  })
}
exports.getAllPagesContent = getAllPagesContent

function genAllPages (doc, context) {
  return getAllPages(doc).then(pages => {
    const renderPromises = pages.map(i => doGenPage(doc, i, context))
    return Promise.all(renderPromises)
  })
}

function doGenPage (doc, pageFileName, context) {
  return DB.getContent(doc, pageFileName).then(templatecontent => {
    const template = Handlebars.compile(templatecontent)
    const rendered = template(context)
    return rendered
  })
}

function genPage (doc, pageFileName, debug) {
  let context = null
  return readContext(doc)
  .then(ctx => {
    context = ctx
    return pageFileName === null
     ? genAllPages(doc, context)
     : doGenPage(doc, pageFileName, context)
  })
  .then(pages => {
    pages = _.isArray(pages) ? pages : [pages]
    return finish(pages, context, debug)
  })
}
exports.genPage = genPage
