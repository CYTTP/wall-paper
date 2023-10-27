'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  //
  const jwt = app.middleware.jwt({ app })
  router.get('/', controller.home.index)
  //验证码
  router.get('/captcha', controller.utils.captcha)
  //发送邮箱验证码
  router.get('/sendcode', controller.utils.sendcode)

  //用户相关
  router.group(
    { name: 'user', prefix: '/user' },
    router => {
      const { info, register, login, verify, uploadAvatar } = controller.user
      router.get('/info', jwt, info)
      router.get('/verify', verify)
      router.post('/register', register)
      router.post('/login', login)
      router.post('/uploadAvatar', uploadAvatar)

    }
  )
  //文章相关
  //获取全部文章
  router.post('/messWalls', controller.article.messWalls)
  //新建文章
  router.post('/insertwall', controller.article.insertwall)
  //喜欢反馈
  router.post('/insertfeedback', controller.article.insertfeedback)
  //新建评论 
  router.post('/insertcomment', controller.article.insertcomment)
  router.post('/findComments', controller.article.findComments)
  router.post('/deletewall', controller.article.deletewall)
  router.post('/deletefeedback', controller.article.deletefeedback)
  router.post('/deletecomment', controller.article.deletecomment)

  //照片相关
  //新建照片
  router.post('/insertphoto', controller.photo.insertphoto)
  //查询所有照片
  router.post('/findallphoto', controller.photo.findallphoto)


  // //上传文件 
  // router.post('/uploadfile', controller.utils.uploadfile)
  // //合并发送文件 
  // router.post('/mergefile', controller.utils.mergefile)
  // //检测是否切片存在
  // router.post('/checkfile', controller.utils.checkfile)


  router.post('/uploadFile', controller.upload.uploadFile);
  router.post('/merge', controller.upload.merge);
  router.post('/simpleUpload', controller.upload.simpleUpload);


}
