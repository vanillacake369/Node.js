const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// create app
const app = express();
// config app setting(port ...)
app.set('port', process.env.PORT || 3000);

// use morgan module
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/',(req,res,next)=>{
    req.cookies;
    req.signedCookies;
    // 'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly;Path=\`,
    req.cookies('name',encodeURIComponent(name),{
        expires: new Date(),
        httpOnly: true,
        path:'/',
    })
})

// middleware
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
app.use((req, res, next) => {
    console.log('1번째 미들웨어 실행');
		next();

}, (req,res,next) => {
    console.log('2번째 미들웨어 실행');
	// throw new Error('에러');
});

// router
// Routing refers to how an application’s endpoints (URIs) respond to client requests
app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행' );
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/category/Javascript', (req,res)=>{
		res.send('hello Javascript');
});

app.get('/category/:name', (req,res)=>{
		res.send('hello wildcard');
});

app.use((req,res,next)=>{
    res.send('404지롱');
});

// 에러 미들웨어에는 next 매개변수를 꼭 넣어주어야 함.
app.use((err,req,res,next)=>{
    console.error(err);
    res.status(600).send('에러났지롱 안 알려주지롱');
})

app.listen(3000, () => {
    console.log('익스프레스 서버 실행');
})