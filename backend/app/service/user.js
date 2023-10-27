
'use strict';
const Service = require('egg').Service;

class UserService extends Service {
    async getUserInfo(params) {
        const { app } = this;
        try {
            const result = await app.mysql.get('user', params);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 通过用户名获取用户信息
    async getUserByName(username) {
        const { app } = this;
        try {
            const result = await app.mysql.get('user', { username });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 通过邮箱号获取用户信息
    async getUserByEmail(email) {
        const { app } = this;
        try {
            const result = await app.mysql.get('user', { email });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    //注册
    async register(params) {
        const { app } = this;
        try {
            const result = await app.mysql.insert('user', params);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async uploadAvatar(imgurl, id) {
        const { app } = this;
        try {
            const sql = `update user set avatar = '${imgurl}' where id = '${id}'`
            const result = await app.mysql.query(sql);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
module.exports = UserService;
