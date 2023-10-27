'use strict';

const BaseController = require('./base')
const path = require('path');
const fse = require('fs-extra');

class UploadController extends BaseController {
    // 每片上传
    async uploadFile() {
        const { ctx } = this;
        // 1.获取上传后的文件
        const file = ctx.request.files[0];
        // 2.将文件名分割 file.filename --- bigFile.27.zip
        const fileNameArr = file.filename.split('.'); // ['bigFile', '27', 'zip']
        // 3. 确定分片存放的位置
        // const UPLOAD_DIR = path.resolve(__dirname, 'public/upload');
        // 4.可能上传多个，根据文明名来存 C:\Users\Administrator\Desktop\vue+ts\egg-example\app\controller\public\upload/bigFile
        const chunkDir = `${this.config.UPLOAD_DIR}/${fileNameArr[0]}`;
        // 5.如果没有这个文件就新增一个
        if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir);
        }
        // C:\Users\Administrator\Desktop\vue+ts\egg-example\app\controller\public\upload\bigFile\96
        // 6. 分片的路径
        const dPath = path.join(chunkDir, fileNameArr[1]);
        // 7.将临时文件移到当前文件 C:\Users\ADMINI~1\AppData\Local\Temp\egg-multipart-tmp\example\2022\11\03\11\ec23238f-56b5-4367-9e39-b754c8b81473.zip
        await fse.move(file.filepath, dPath, { overwrite: true });
        // ctx.body = { sliceKey: fileNameArr[1], msg: '单片上传成功' };
        this.success({ sliceKey: fileNameArr[1], msg: '单片上传成功' })
    }
    //合并上传
    async merge() {
        // 1.先获取存放的目录
        // const UPLOAD_DIR = path.resolve(__dirname, 'public/upload');
        const { ctx } = this;
        // 2.拿到文件名 bigFile.zip
        const { name } = ctx.request.body;
        // 3. 拿到文件名 bigFile
        const fname = name.split('.')[0];
        // 4. 分片所在位置  // C:\Users\Administrator\Desktop\vue+ts\egg-example\app\controller\public\upload\bigFile
        const chunkDir = path.join(this.config.UPLOAD_DIR, fname);
        console.log(chunkDir);
        // 5. 读取所有的分片 ['0', '1', .............]
        // 读取一个目录的内容
        const chunks = await fse.readdir(chunkDir);
        // 然后按照片数得从小到大进行排列，然后再合并
        chunks.sort((a, b) => a - b).map(chunkPath => {
            // 合并文件
            fse.appendFileSync(
                path.join(this.config.UPLOAD_DIR, name),
                fse.readFileSync(`${chunkDir}/${chunkPath}`)
            );
        });
        // 删除临时文件夹
        fse.removeSync(chunkDir);
        // ctx.body = '合并成功';
        this.success('合并成功')
    }

    // 简单上传
    async simpleUpload() {
        const { ctx } = this;
        const { userId, username, label, moment } = ctx.request.body
        // 1.获取上传后的文件
        const file = ctx.request.files[0];
        // const UPLOAD_DIR = path.resolve(__dirname, 'public/upload');
        const dPath = path.join(this.config.UPLOAD_DIR, file.filename);
        console.log(dPath);
        const day = Date.now()
        // 7.将临时文件移到当前文件
        await fse.move(file.filepath, dPath, { overwrite: true });
        //入库
        const toFileName = `http://127.0.0.1:7001/public/upload/${file.filename}`
        await ctx.service.photo.insertphoto(toFileName, userId, username, label, moment);
        this.success({
            url: toFileName,
            time: moment
        })
    }
}

module.exports = UploadController;

