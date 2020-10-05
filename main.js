const http = require('http');
const https = require('https');
const app=require('./app');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem')
};
//const port = process.env.PORT || 3000;
const port = 3000;
const server =  http.createServer(app);
server.listen(port);
console.log('server started');

const httpsserver =  https.createServer(options,app);
httpsserver.listen(3001);
console.log('https server started');
