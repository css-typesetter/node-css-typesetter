const tmp = require('tmp')
const puppeteer = require('puppeteer')
const fs = require('fs')

function _sendAndCleanup (file, outstream) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(file)
    rs.pipe(outstream)
    rs.on('end', () => {
      fs.unlink(file)
      resolve()
    })
    rs.on('error', reject)
    rs.read()
  })
}

module.exports = async (doc, pagenum, outstream, context) => {
  const browser = await puppeteer.launch()// {headless: false})
  const page = await browser.newPage()
  const pageName = pagenum ? `page${pagenum}.html` : 'index.html'
  await page.goto(`${process.env.HOSTURL}/${doc}/${pageName}`, {
    waitUntil: 'networkidle2'
  })
  let outFile = tmp.tmpNameSync({template: '/tmp/_render_XXXXXX.pdf'})
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  await page.emulateMedia('screen')
  await page.waitFor(3000)
  await page.pdf({
    path: outFile,
    width: context.width + 'cm',
    height: context.height + 'cm',
    printBackground: true
  })
  await _sendAndCleanup(outFile, outstream)
  return browser.close()
}
