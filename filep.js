const http = require('http');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const request = require('request');

http.createServer((req, res) => {
  if (req.method === 'POST') {
    console.log('post recebido');
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      var saveTo = path.basename(fieldname);
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', () => {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
      console.log('processado')
    });
    return req.pipe(busboy);
  }
  res.writeHead(404);
  res.end();
}).listen(8001, () => {
  console.log('Listening for requests');
});
