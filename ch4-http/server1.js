
const http = require('http');

http.createServer((req, res) => {
    res.write('<h1>hello<h1>');
    res.write('<h2>hell<h2>');
    res.end('<h3>header3<h3>');
})
    .listen(8080, () => {
        console.log('8080번 노드에서 서버 대기 중입니다.');
    }); // 포트 8080에 연결하여 프로세스 생성 / 실행