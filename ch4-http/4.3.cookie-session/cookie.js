const http = require('http');

http.createServer((req,res)=>{
    console.log(req.url,req.headers.cookie);
    res.writeHead(200, {'Set-Cookie':'myCookie=test'});
    res.end('Hello Cookie');
})
    .listen(8003,()=>{
        console.log('80003포트에서 서버 대기중');
    });