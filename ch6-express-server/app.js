const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log('모든 요청에 실행');
})

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행');
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/filteringQuery=?', (req, res) => {
    res.send('filter query');
})

app.listen(3000, () => {
    console.log('익스프레스 서버 실행');
})