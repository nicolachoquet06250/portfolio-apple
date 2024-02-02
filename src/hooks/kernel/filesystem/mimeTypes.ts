/**
 * @author nicolachoqyet06250
 *
 * use this lib for uncompress archive in javascript from web worker :
 * https://github.com/nika-begiashvili/libarchivejs?ref=hackernoon.com
 *
 * use this lib for compress archives in javascript :
 * https://github.com/Stuk/jszip
 *
 * use this lib for read word (docx) documents in HTML :
 * https://github.com/scuderia-fe/docx-to-html
 *
 * invert, use this lib :
 * https://github.com/caiyexiang/html-docx-js-typescript
 *
 * for convert excels documents to html and invert, use this lib :
 * https://docs.sheetjs.com/
 *
 * @source https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */

export default {
    // images
    png: 'image/png',
    apng: 'image/apng',
    avif: 'image/avif',
    gif: 'image/gif',
    ico: 'image/vnd.microsoft.icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    webp: 'image/webp',

    // audios
    mp3: 'audio/mpeg',
    oga: 'audio/ogg',
    opus: 'audio/opus',
    wav: 'audio/wav',
    weba: 'audio/webm',

    // video
    mp4: 'video/mp4',
    mpeg: 'video/mpeg',
    ogv: 'video/ogg',
    webm: 'video/webm',

    // audio - video mix
    '3gp': [
        'video/3gpp',
        'audio/3gpp'
    ],
    '3g2': [
        'video/3gpp2',
        'audio/3gpp2'
    ],

    // archives
    '7z': 'application/x-7z-compressed',
    bz: 'application/x-bzip',
    bz2: 'application/x-bzip2',
    gz: 'application/gzip',
    rar: 'application/vnd.rar',
    tar: 'application/x-tar',

    // applications
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    arc: 'application/x-freearc',
    csh: 'application/x-csh',
    sh: 'application/x-sh',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
    jsonld: 'application/ld+json',
    pdf: 'application/pdf',
    php: 'application/x-httpd-php',
    rtf: 'application/rtf',
    xhtml: 'application/xhtml+xml',
    xml: 'application/xml',
    zip: 'application/zip',

    // text
    css: 'text/css',
    csv: 'text/csv',
    html: 'text/html',
    htm: 'text/html',
    ics: 'text/calendar',
    js: 'text/javascript',
    mjs: 'text/javascript',
    txt: 'text/plain',
} as const;
