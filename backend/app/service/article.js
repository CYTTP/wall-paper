'use strict';
const Service = require('egg').Service;

class ArticleService extends Service {
    async getWallData(type, page, pagesize, label) {
        const { app } = this;
        try {
            let _sql;
            if (label == -1) {
                _sql = `select * from walls where type = ${type} order by id desc limit ${(page - 1) * pagesize}, ${pagesize};`
            } else {
                _sql = `select * from walls where type = ${type} and label='${label}' order by id desc limit ${(page - 1) * pagesize}, ${pagesize};`
            }
            const result = await app.mysql.query(_sql);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async insertwall(params) {
        const { app } = this;
        try {
            let _sql = 'insert into walls set type=?,message=?,name=?,userId=?,moment=?,label=?,color=?,imgurl=?'
            const result = await app.mysql.query(_sql, params)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async insertfeedback(params) {
        const { app } = this;
        try {
            let _sql = 'insert feedbacks set wallId=?,userId=?,type=?,moment=?;'
            const result = await app.mysql.query(_sql, params)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async insertcomment(params) {
        const { app } = this;
        try {
            let _sql = 'insert comments set wallId=?,userId=?,imgUrl=?,moment=?,comment=?,name=?'
            const result = await app.mysql.query(_sql, params)
            // console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async feedbackCount(wid, type) {
        const { app } = this;
        try {
            let _sql = `select count(*) as count from feedbacks where wallId = '${wid}' and type = '${type}';`
            const result = await app.mysql.query(_sql)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async commentCount(wid) {
        const { app } = this;
        try {
            let _sql = `select count(*) as count from comments where wallId = '${wid}';`
            const result = await app.mysql.query(_sql)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async likeCount(wid, uid) {
        const { app } = this;
        try {
            let _sql = ` select count(*) as count from feedbacks where wallId ='${wid}' and userId='${uid}' and type=0;`
            const result = await app.mysql.query(_sql)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findComments(id, page, pagesize) {
        const { app } = this;
        try {
            let _sql = `select * from comments where wallId = '${id}' order by id desc limit ${(page - 1) * pagesize}, ${pagesize};`
            const result = await app.mysql.query(_sql)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = ArticleService