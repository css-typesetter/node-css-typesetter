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

exports.readContext = () => {
  return new Promise((resolve, reject) => {
    const pageFile = path.join(process.env.DATAFOLDER, `context.json`)
    fs.readFile(pageFile, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(JSON.parse(data))
    })
  })
}

exports.genPage = (num, context) => {
  return new Promise((resolve, reject) => {
    const pageFile = path.join(process.env.DATAFOLDER, `page${num}.html`)
    fs.readFile(pageFile, 'utf8', (err, templatecontent) => {
      if (err) return reject(err)
      const template = Handlebars.compile(templatecontent)
      const rendered = template(context)
      resolve(rendered)
    })
  })
}

exports.readStatic = (filepath) => {
  return new Promise((resolve, reject) => {
    const file = path.join(process.env.DATAFOLDER, filepath)
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
