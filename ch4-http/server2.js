const http = require('http');
const fs = require('fs');
const { Http2ServerRequest } = require('http2');

http.createServer((req, res) => {
    fs.readFile('./server2.html', (err, data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
}).listen(8081, () => {
    console.log('8081 port using from server2')
})