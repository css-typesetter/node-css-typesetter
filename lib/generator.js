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

function wait (sec) {
  return new Promise(resolve => {
    setTimeout(resolve, sec)
  })
}

module.exports = async (doc, outstream, context) => {
  const browser = await puppeteer.launch()// {headless: false})
  const page = await browser.newPage()
  await page.goto(`${process.env.HOSTURL}/${doc}/index.html`, {
    waitUntil: 'networkidle2'
  })
  await wait(5)
  let outFile = tmp.tmpNameSync({template: '_render_XXXXXX.pdf'})
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  await page.emulateMedia('screen')
  await page.pdf({
    path: outFile,
    width: context.width,
    height: context.height,
    printBackground: true
  })
  await _sendAndCleanup(outFile, outstream)
  return browser.close()
}
