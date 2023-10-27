'use strict';
const Service = require('egg').Service;

class PhotoService extends Service {

    async findallphoto(page, pagesize, userId, label) {
        const { app } = this;
        try {
            let _sql;
            if (label == -1) {
                _sql = `select * from photos limit ${(page - 1) * pagesize}, ${pagesize};`
            } else {
                _sql = `select * from photos where label='${label}' order by pid desc limit ${(page - 1) * pagesize}, ${pagesize};`
            }
            //TODO 根据id查找
            const result = await app.mysql.query(_sql)
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async insertphoto(imgPath, userId, username, label, moment) {
        const { app } = this;
        try {
            let _sql = 'insert photos set imgPath=?,userId=?,username=?,label=?, moment=?'
            const result = await app.mysql.query(_sql, [imgPath, userId, username, label, moment])
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}






module.exports = PhotoService