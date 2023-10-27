'use strict'
const { Service } = require('egg')
const nodemailer = require('nodemailer')
const fse = require('fs-extra')
const path = require('path')



const userEmail = '';//设置发送邮件的邮箱

const transporter = nodemailer.createTransport({
    service: 'qq',// 调用qq服务器
    secureConnection: true,// 启动SSL
    port: 465,// 端口就是465
    auth: {
        user: userEmail,
        pass: 'cpecvhxgkwxrbiaf' //授权码
    }
})

class ToolsService extends Service {
    //注意sendMail不要修改名称  好多坑。。
    async sendMail(email, subject, text, html) {
        const mailOption = {
            from: userEmail,
            cc: userEmail,
            to: email,
            sub: subject,
            text,
            html
        }
        try {
            await transporter.sendMail(mailOption)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async mergeFile(filePath, hash, size) {
        // console.log('UPLOAD_DIR' + this.config.UPLOAD_DIR);
        const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash) //切片的文件夹
        let chunks = await fse.readdir(chunkDir)
        chunks.sort((a, b) => a.split('—')[1] - b.split('-')[1])
        chunks = chunks.map(v => path.resolve(chunkDir, v))
        await this.mergeChunks(chunks, filePath, size)
    }
    async mergeChunks(files, dest, size) {
        //文件流
        const pipStream = (filePath, writeStream) => new Promise(resolve => {
            const readStream = fse.createReadStream(filePath)
            readStream.on('end', () => {
                fse.unlinkSync(filePath)
                resolve()
            })
            readStream.pipe(writeStream)
        })
        await Promise.all(
            files.map((file, index) => {
                pipStream(file, fse.createWriteStream(dest, {
                    start: Math.floor(index * size),
                    end: (index + 1) * size
                }))
            })
        )
    }
}






module.exports = ToolsService