const DB = require('./db')
const Handlebars = require('handlebars')

Handlebars.registerHelper('PART', (content) => {
  return new Handlebars.SafeString(content)
})

function finish (pages, context) {
  return `
<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8">
    ${context.extrasstyle ? context.extrasstyle.reduce((acc, i) => {
      return acc + `<link rel="stylesheet" href="${i}"/>\n`
    }, '') : ''}
    <link rel="stylesheet" href="static/style.css">
  </head>
  <body>
  ${pages.reduce((acc, i) => (acc + `<div class="a4">${i}</div>\n`), '')}
  </body>
</html>`
}

function readContext (doc) {
  return DB.getContent(doc, 'context.json').then(content => {
    return JSON.parse(content)
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

function genPage (doc, pageFileName) {
  let context = null
  return readContext(doc)
  .then(ctx => {
    context = ctx
    return pageFileName === null
     ? genAllPages(doc, context)
     : doGenPage(doc, pageFileName, context)
  })
  .then(pages => {
    return finish(pages, context)
  })
}
exports.genPage = genPage
