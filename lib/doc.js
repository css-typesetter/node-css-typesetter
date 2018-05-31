const path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')

Handlebars.registerHelper('PART', (content) => {
  return new Handlebars.SafeString(content)
})

exports.finish = (pages, context) => {
  return `
<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8">
    ${context.extrasstyle.reduce((acc, i) => {
      return acc + `<link rel="stylesheet" href="${i}"/>\n`
    }, '')}
    <link rel="stylesheet" href="static/style.css">
  </head>
  <body>
  ${pages.reduce((acc, i) => (acc + `<div class="a4">${i}</div>\n`), '')}
  </body>
</html>
  `
}

exports.readContext = (doc) => {
  return new Promise((resolve, reject) => {
    const pageFile = path.join(process.env.DATAFOLDER, doc, `context.json`)
    fs.readFile(pageFile, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(JSON.parse(data))
    })
  })
}

function getAllPages (doc) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(process.env.DATAFOLDER, doc), (err, dircontent) => {
      if (err) return reject(err)
      const pages = dircontent.filter(i => i.match(/page([0-9]+).html/))
      resolve(pages)
    })
  })
}

function genAllPages (doc, context) {
  return getAllPages(doc).then(pages => {
    const renderPromises = pages.map(i => genPage(doc, i, context))
    return Promise.all(renderPromises)
  })
}

function genPage (doc, pageFileName, context) {
  return pageFileName === null
    ? genAllPages(doc, context)
    : new Promise((resolve, reject) => {
      const pageFile = path.join(process.env.DATAFOLDER, doc, pageFileName)
      fs.readFile(pageFile, 'utf8', (err, templatecontent) => {
        if (err) return reject(err)
        const template = Handlebars.compile(templatecontent)
        const rendered = template(context)
        resolve(rendered)
      })
    })
}
exports.genPage = genPage

exports.readStatic = (doc, filepath) => {
  return new Promise((resolve, reject) => {
    const file = path.join(process.env.DATAFOLDER, filepath)
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
