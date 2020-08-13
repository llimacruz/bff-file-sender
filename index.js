const request = require('request');
const http = require('http');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');


const senderToFileProcessor = (filename, callback) => {
  const formData = {
    my_field: 'my_value',
    my_file: fs.createReadStream(__dirname + '/' + filename),
  };

  request.post({ url: 'http://localhost:8001', formData: formData }, (err, httpResponse, body) => {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    callback();
  });
}

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
      // aqui acabou de receber o arquivo do NextJS
      // já pode fazer o post no processador de arquivos
      senderToFileProcessor('testef', () => {
        res.end("That's all folks!");
        console.log('processado')
      })

    });
    return req.pipe(busboy);
  }
  res.writeHead(404);
  res.end();
}).listen(8000, () => {
  console.log('Listening for requests');
});
