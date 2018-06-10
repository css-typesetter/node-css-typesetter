# Node CSS typesetter

Backend server for [css-typesetter-webclient](https://github.com/css-typesetter/css-typesetter-webclient) - tool
for building paged documents typeset by CSS and HTML.

CSS allows typesetting since [page module](http://www.w3.org/TR/css3-page/).
Lots have been written on this topic e.g. [Building Books with CSS3](http://alistapart.com/article/building-books-with-css3) or [print-css.rocks](https://print-css.rocks/index.html).
Other useful links:
- [mozilla - columns](https://developer.mozilla.org/en-US/docs/Web/CSS/columns)

This project aims to allow user to work online (in browser) without any aditional tool.

## configuration

[dotenv](https://www.npmjs.com/package/dotenv) reads config file and setup following envvars:
- HOSTURL: __mandatory__ public url of this API endpoint rendering full document
- DATAFOLDER: __mandatory__ folder containing particular documents (writable folder)
- PORT: port to listen (default 3000)

### install chrome in headless debian based server

Following list of libraries are needed:

```
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

Useful when issues with rendering: https://github.com/GoogleChrome/puppeteer/issues/2230
