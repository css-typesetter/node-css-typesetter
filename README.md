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

Following list of libraries are needed (incomplete, I have not noted the full list):

```
aptitude install libasound2 libxss1 libatk-bridge2.0-0 libgtk-3-0
```
