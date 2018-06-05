const path = require('path')
const fs = require('fs')

function _getDocFolder (doc) {
  return path.join(process.env.DATAFOLDER, doc)
}

function _getContent (doc, filename) {
  return new Promise((resolve, reject) => {
    const file = path.join(_getDocFolder(doc), filename)
    fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data))
  })
}
exports.getContent = _getContent

exports.createDir = (doc) => {
  return new Promise((resolve, reject) => {
    const folder = _getDocFolder(doc)
    fs.mkdir(folder, (err) => err ? reject(err) : resolve())
  })
}

function _createFile (doc, filename, content) {
  return new Promise((resolve, reject) => {
    const file = path.join(_getDocFolder(doc), filename)
    fs.writeFile(file, content, 'utf8', (err) => err ? reject(err) : resolve())
  })
}
exports.createFile = _createFile

exports.updateFile = (doc, file, content) => {
  return _createFile(doc, file, content)
}

exports.listFolder = (doc) => {
  return new Promise((resolve, reject) => {
    fs.readdir(_getDocFolder(doc), (err, dircontent) => {
      if (err) return reject(err)
      resolve(dircontent)
    })
  })
}
