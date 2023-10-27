const BaseController = require('./base')

class ArticleController extends BaseController {
    async messWalls() {
        const { ctx } = this
        const { type, page, pagesize, label, userId } = ctx.request.body;
        await ctx.service.article.getWallData(type, page, pagesize, label, userId).then(async res => {
            for (let i = 0; i < res.length; i++) {
                //喜欢
                res[i].like = await ctx.service.article.feedbackCount(res[i].id, 0)
                //举报
                // result[i].report = await dbModel.feedbackCount(result[i].id, 1)
                // //撤销
                // result[i].revoke = await dbModel.feedbackCount(result[i].id, 2)
                // //是否点赞
                res[i].islike = await ctx.service.article.likeCount(res[i].id, userId)
                // //评论数
                res[i].comments = await ctx.service.article.commentCount(res[i].id)
            }
            this.success(res)
        })

    }
    async insertwall() {
        const { ctx } = this;
        const { type, message, name, userId, moment, label, color, imgurl } = ctx.request.body;
        const info = await ctx.service.article.insertwall([type, message, name, userId, moment, label, color, imgurl]);
        this.success(info)

    }
    async insertfeedback() {
        const { ctx } = this;
        const { wallId, userId, type, moment } = ctx.request.body;
        const info = await ctx.service.article.insertfeedback([wallId, userId, type, moment]);
        this.success(info)

    }
    async insertcomment() {
        const { ctx } = this;
        const { wallId, userId, imgUrl, moment, comment, name } = ctx.request.body
        const info = await ctx.service.article.insertcomment([wallId, userId, imgUrl, moment, comment, name]);
        this.success({ info })

    }
    async findComments() {
        const { ctx } = this;
        const { id, page, pagesize } = ctx.request.body
        const info = await ctx.service.article.findComments(id, page, pagesize);
        this.success({
            info

        })
    }
    async deletewall() {

    }
    async deletefeedback() {

    }
    async deletecomment() {

    }
}

module.exports = ArticleController