import Joi from "joi";
// @ts-ignore
import md5 from "md5";
import {getDB} from "~/server/utils/db/mysql";
import {responseJson} from "~/server/utils/helper";
/**
 * 1、获取数据
 * 2、数据校验
 * 3、密码加密
 * 4、判断账号是否注册
 * 5、创建账号
 */

export default defineEventHandler(async (event)=>{
    //获取数据
    const body = await readBody(event)
    console.log('11111',body)

    //校验数据joi
    const schema = Joi.object({
        nickname: Joi.string().required(),
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
       const [rows] = await con.execute('select * from `users` where `phone`=?',[body.phone]);
       console.log('22222',rows)
       if (rows.length > 0){
           return responseJson(1,'账号已注册',{})
       }
       //创建账号
       const [rows2] = await con.execute('insert into `users` (`nickname`,`phone`,`password`) value (?,?,?)',[body.nickname,body.phone,password]);
       console.log('333333',rows2)
       //释放连接
       await con.end()
       if (rows2.affectedRows === 1){
           return  responseJson(0,'注册成功',{})
       }
   }catch (e){
       //释放连接
       await con.end()
       return responseJson(1,'服务器错误',{})
   }


})
