const Doc = require('../lib/doc')
const path = require('path')
process.env.DATAFOLDER = path.join(__dirname, 'testdata')

let context = null

Doc.readContext()
.then(readcontext => {
  context = readcontext
  return Doc.genPage(1, context)
})
.then(content => {
  const doc = Doc.finish([content], context)
  console.log(doc)
})
