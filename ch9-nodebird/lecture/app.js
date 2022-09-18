// import modules
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

// set environment variable
// process.env 객체를 아래에서 쓰이기 때문에 dotenv.config()는 최대한 위에서 선행으로 호출해주는 게 좋음
dotenv.config();
// set homepage router
const pageRouter = require('./routes/page');

// start & set express 
const app = express();
// process.env.PORT가 없기 때문에 OR연산자를 통해 8001 포트를 사용
// 나중에 배포 시, PORT를 지정해줄 것임
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
// template engine conf : 1.views의 경로 2.app객체연결 3.html파일변경때마다템플릿엔진reload
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.morgan('dev');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// express에 process.env내장객체로 암호화된 쿠키 사용하기
app.use(cookieParser(process.env.COOKIE_SECRET));
//
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// link '/'request to pageRouter 변수
app.use('/', pageRouter);

// 요청에 대해 등록된 라우터 없는 경우의 에러 세팅 : 404
// 에러처리 미들웨어는 next 반드시 넣어줘야함
app.use((req, res, next) => {
    // req.method : get이냐,post냐 등등
    const error = new Error(`${req.method}${req.url}라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
// 에러처리 미들웨어 
// 템플릿 엔진의 변수(res.locals)에 에러상태코드 넘김
// production 서버가 아닌 경우의 에러 : 500
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // process.env.NODE_ENV가 개발모드(dev)일 때는 err 표시, 배포(production)일 때는 빈 객체를 넘겨 에러내역을 안 보여주게함
    res.locals.error = (process.env.NODE_ENV !== 'production') ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// port에서 대기
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})