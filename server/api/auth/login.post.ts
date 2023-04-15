import Joi from "joi";
import {responseJson} from "~/server/utils/helper";
import {getDB} from "~/server/utils/db/mysql";
// @ts-ignore
import md5 from "md5";
// @ts-ignore
import jwt from "jsonwebtoken"

/**
 * 1、获取客户端传来的手机号和密码
 * 2、数据校验
 * 3、查询数据库，如果不存在手机则返回手机号不存在或者密码错误
 * 4、如果已经注册，并且密码正确，就生成token，并返回给客户端，token根据jwt生成
 */
export default defineEventHandler(async (event)=>{
    //获取数据
    const body = await readBody(event)
    console.log('11111',body)

    //校验数据joi
    const schema = Joi.object({
        password:Joi.string().required(),
        phone:Joi.string().pattern(/1\d{10}/),
    });
    try {
        const value = await schema.validateAsync(body);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }

    //密码加密md5
    let salt = 'ueidfisgfilegfiff'
    let password = md5(md5(body.password)+salt)
    const con = getDB()
    try {
        //查询数据库
        const [rows] = await con.execute('SELECT * FROM `users` WHERE `phone`=? AND `password`=?',
            [body.phone,password]);
        console.log('22222',rows)
        if (rows.length === 0){
            return responseJson(1,'账号不存在或者密码错误',{})
        }
        //释放连接
        await con.end()
        //生成token jsonwebtoken
        //秘钥
        let secret = 'eifuisedfuvs'
        let token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {data:{uid:rows[0].id}}
        }, secret);

        //返回
        return responseJson(0,'ok',{
            accessToken:token,
            userInfo:{
                id:rows[0].id,
                nickname:rows[0].nickname,
                phone:rows[0].phone,
                avatar:rows[0].avatar,
            }
        })

    }catch (e){
        //释放连接
        await con.end()
        return responseJson(1,'服务器错误',{})
    }


})
