const BaseController = require('./base')

class PhotoController extends BaseController {

    async insertphoto() {

    }
    async findallphoto() {
        const { ctx } = this
        const { page, pagesize, userId, label } = ctx.request.body;
        const info = await ctx.service.photo.findallphoto(page, pagesize, userId, label);
        this.success(info)

    }
}

module.exports = PhotoController