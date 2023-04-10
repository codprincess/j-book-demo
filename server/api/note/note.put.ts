/**
 * 1、判断用户是否登录
 * 2、已登录则修改文章
 */

import Joi from "joi";
import {getDB} from "~/server/utils/db/mysql";
import {genTitle, getLoginUid, responseJson} from "~/server/utils/helper";


export default defineEventHandler(async (event)=>{
    //判断用户登录
    let uid = getLoginUid(event)
    console.log('uid',uid)
    if (uid === 0) {
        // @ts-ignore
        setResponseStatus(event,401)
        return responseJson(1,'请先登录',{})
    }
    //获取数据
    const body = await readBody(event)
    console.log('11111',body)

    //校验数据joi
    const schema = Joi.object({
        noteId: Joi.number().required(),
        title:Joi.string().required(),
        content_md:Joi.string().required(),
        state:Joi.number().required(),
    });
    try {
        const value = await schema.validateAsync(body);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }


    const con = getDB()
    try {
        //修改文章
        const [rows] = await con.execute('UPDATE  `notes` SET `title`=?,`content_md`=?,`state`=? WHERE `id`=? AND `uid`=?',
            [body.title,body.content_md,body.state,body.noteId,uid]);
        //释放连接
        await con.end()
        if (rows.affectedRows === 0){
            return  responseJson(1,'修改失败',{})
        }
        return responseJson(0,'修改成功',{})

    }catch (e){
        //释放连接
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }


})
