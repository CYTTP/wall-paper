const jwt = require('jsonwebtoken')
//解析token中间件
module.exports = ({ app }) => {
    return async function verify(ctx, next) {
        // console.log('auth===', ctx.request.header.authorization);
        if (ctx.request.header.authorization === '') {
            // console.log('出现了');
            ctx.body = {
                code: 205,
                message: '用户没有登录'
            }
            return
        }
        // const token = ctx.request.header.authorization
        const token = ctx.request.header.authorization.replace('Bearer ', '')
        try {
            const ret = await jwt.verify(token, app.config.jwt.secret)
            // console.log('===', ret);
            ctx.state.email = ret.email
            ctx.state.id = ret.id
            await next()

        } catch (error) {
            console.log(error);

            if (error.name == 'TokenExpiredError') {
                ctx.body = {
                    code: 205,
                    message: '登录过期了'
                }
            } else {
                ctx.body = {
                    code: 205,
                    message: '用户信息出错'
                }
            }
        }
    }
}