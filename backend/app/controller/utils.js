
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const BaseController = require('./base')
const path = require('path')

class utilsController extends BaseController {

    async captcha() {
        const captcha = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            noise: 3
        })
        // console.log(captcha.text)
        //存到session
        this.ctx.session.captcha = captcha.text
        this.ctx.response.type = "image/svg+xml"
        this.ctx.body = captcha.data
    }
    async sendcode() {
        const { ctx } = this
        const email = ctx.query.email
        let code = Math.random().toString().slice(2, 6)
        console.log('邮箱验证码', code);
        ctx.session.emailcode = code

        const subject = '博彩验证码'
        const text = ''
        const html = `<h2>搏一搏</h2><span>${code}</span>`
        const hasSend = await this.service.tools.sendMail(email, subject, text, html)
        if (hasSend) {
            this.message('发送成功，注意查收')
        } else {
            this.error('发送失败')
        }
    }
    //上传文件
    async uploadfile() {
        //模拟报错 测试切片连续上传功能
        // if (Math.random() * 0.3) {
        //     return this.ctx.status = 500
        // }

        const { ctx } = this
        const file = ctx.request.files[0]
        const { name, hash } = ctx.request.body

        const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)

        if (!fse.existsSync(chunkPath)) {
            await fse.mkdir(chunkPath)
        }
        //文件移动到chunkPath文件夹
        await fse.move(file.filepath, `${chunkPath}/${name}`)
        this.message('切片上传成功')
    }
    //合并文件
    async mergefile() {
        const { hash, size, ext } = this.ctx.request.body
        const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

        await this.ctx.service.tools.mergeFile(filePath, hash, size)
        this.success({
            url: `/public/${hash}.${ext}`
        })
    }
    async checkfile() {
        const { ctx } = this
        const { ext, hash } = ctx.request.body
        const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

        let uploaded = false
        let uploadList = []
        if (fse.existsSync(filePath)) {
            //文件存在
            uploaded = true
        } else {
            uploadList = await this.getUploadList(path.resolve(this.config.UPLOAD_DIR, hash))
        }
        this.success({
            uploaded,
            uploadList
        })

    }
    async getUploadList(dirPath) {
        return fse.existsSync(dirPath) ? fse.readdir(dirPath) : []

    }
}

module.exports = utilsController