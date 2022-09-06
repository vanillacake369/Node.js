const express = require('express');
const { Comment, User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        /* #1 
        req.body.id로 넘어온 id -> Comment.commenter컬럼 : id와 연관관계 되어있음
        req.body.id로 넘어온 comment -> Comment.comment컬럼
        */
        const comment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });

        /* #2
        1. req.body.id로 user 찾은 후
        2. req.body.comment에 대한 comment 생성 : id(주인)이 없는 댓글 생성
        3. user.addComment로 해당 댓글 연동
        
        const user = await User.findOne({ where: { id: req.body.id } });
        const comment = await Comment.create({
            comment: req.body.comment,
        });
        */
        await user.addComment(comment);
        console.log(comment);
        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.route('/:id')
    .patch(async (req, res, next) => {
        try {
            const result = await Comment.update({
                comment: req.body.comment,
            }, {
                where: { id: req.params.id },
            });
            res.json(result);
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const result = await Comment.destroy({ where: { id: req.params.id } });
            res.json(result);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

module.exports = router;