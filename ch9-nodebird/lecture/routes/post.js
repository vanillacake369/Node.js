const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
/**
 * uploads 폴더 생성 : mkdirSync
 */
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // 이미지 업로드
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` }); // error
    // 이 url을 프론트에 반환하여 이미지 처리 이후 게시글 처리할 때도 같이 처리할 수 있게
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // body data 업로드
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); // 정규표현식 : ("문자열").match(/정규표현식/플래그)
        // [#노드, #익스프레스]
        // [노드,익스프레스]
        // [findOrCreate(노드),findOrCreate(익스프레스)]
        // Promise이므로 Promise.all을 사용하여 시퀄라이즈 쿼리 실행 => 쿼리결과값을 이차원 배열로서 반환
        // find했으면 false, create이면 true
        // [[Hashtag객체1,true],[Hashtag객체2,true]]
        // 시퀄라이즈 문법 중 add인스턴스 메서드의 파라미터로서... 1.컬럼의 id 2.쿼리결과객체
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag=>{
                    return Hashtag.findOrCreate({
                        where:{title:tag.slice(1).toLowerCase()},
                    })
                }),
            );
            await post.addHashtags(result.map(r=>r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;