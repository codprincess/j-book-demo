// @ts-ignore
import jwt from "jsonwebtoken";

/***
 * 1、获取token
 * 2、判断token，如果有token，则处理token，之后再验证token值
 */
export default defineEventHandler((event)=>{
    //获取token值
    let token = getHeader(event,"Authorization")
    console.log('token',token)
    if (token) {
        //处理token
        token = token.replace("Bearer ","")
        //秘钥
        let secret = 'eifuisedfuvs'
        try {
            //验证token
            var decoded = jwt.verify(token, secret);
            console.log('1111',decoded.data.data.uid)
            //传递给上下文
            event.context.auth = {uid:decoded.data.data.uid}

        }catch (e) {
            console.log('jwt 解码错误',e)
        }
    }
})
