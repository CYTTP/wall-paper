const BaseController = require('./base')
const jwt = require('jsonwebtoken')
const fse = require('fs-extra')
const fs = require('fs')
const path = require('path')
const moment = require('moment');
const mkdirp = require('mkdirp');

const createVal = {
    email: { type: "email" },
    username: { type: "string" },
    password: { type: "string" },
    captcha: { type: "string" },

}

class UserController extends BaseController {
    //登录
    async login() {
        const { ctx, app } = this;
        const { email, password, emailcode } = ctx.request.body;
        //验证emailcode
        if (emailcode != ctx.session.emailcode) {
            return this.error('邮箱验证码错误')
        }
        const userInfo = await ctx.service.user.getUserByEmail(email);
        if (!userInfo || !userInfo.id) {
            return this.error('账号不存在', 500)
        }
        if (userInfo && password !== userInfo.password) {
            return this.error('账号密码错误', 500)
        }
        // token 生成
        const token = jwt.sign(
            {
                id: userInfo.id,
                email: userInfo.email,
            },
            app.config.jwt.secret, {
            expiresIn: '1h'
        });
        // console.log('token==', token);
        this.success({ message: '登录成功', token: token })
    }
    async info() {
        const { ctx } = this;
        const { email } = ctx.state
        const userInfo = await ctx.service.user.getUserByEmail(email);
        const defaultAvatar = ''
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                id: userInfo.id,
                username: userInfo.username,
                email: userInfo.email || '',
                avatar: userInfo.avatar || defaultAvatar,
            },
        };

    }
    async verify() {

    }
    async register() {

        const { ctx } = this
        try {
            ctx.validate(createVal)
        } catch (e) {
            return this.error('参数校验失败', 201, e.errors)
        }
        const { email, username, password, captcha } = ctx.request.body
        const userInfo = await ctx.service.user.getUserByName(username);
        // console.log('用户信息 === ', userInfo);
        //验证captcha
        if (captcha.toUpperCase() != ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        //验证用户名是否重复
        if (userInfo && userInfo.id) {
            return this.error('用户名已被注册，请重新输入', 500)
        }
        const result = await ctx.service.user.register({
            username,
            password,
            email,
            ctime: new Date().getTime(),
            avatar: '',
        });
        if (result) {
            return this.success({ message: '注册成功', })
        } else {
            return this.error('注册失败', 500)
        }
    }
    async checkEmail() {

    }
    //上传头像
    async uploadAvatar() {
        const { ctx } = this;
        const { userId } = ctx.request.body
        try {
            // 0、获取文件
            let file = ctx.request.files[0];
            // console.log('获取文件', file);
            // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
            let fileData = fs.readFileSync(file.filepath);
            // console.log('fileData', fileData);
            // 1、获取当前日期
            let day = moment(new Date()).format('YYYYMMDD');
            // console.log('1、获取当前日期', day);
            // 2、创建图片保存的路径
            let dir = path.join(this.config.UPLOAD_AVATAR_DIR, day);
            // console.log('2、创建图片保存的路径', dir);
            // 3、创建目录
            await mkdirp(dir);
            // 4、生成路径返回
            let date = Date.now(); // 毫秒数
            let tempDir = path.join(dir, date + path.extname(file.filename)); // 返回图片保存的路径
            // console.log('毫秒数 extname', date, path.extname(file.filename));
            // console.log('返回图片保存的路径', tempDir);
            // 5、写入文件夹
            fs.writeFileSync(tempDir, fileData);
            // 6.入库操作
            const pename = date + path.extname(file.filename)
            const toFileName = `http://127.0.0.1:7001/public/avatar/${day}/${pename}`
            await ctx.service.user.uploadAvatar(toFileName, userId);
            this.success({
                url: toFileName
            })
        } catch (error) {
            this.error('上传失败')
        } finally {
            // 6、清除临时文件
            ctx.cleanupRequestFiles();
        }


    }
}

module.exports = UserController;