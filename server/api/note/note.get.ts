/**
 * 1、判断用户是否登录
 * 2、已登录则获取用户的文章
 */

import {getDB} from "~/server/utils/db/mysql";
import {getLoginUid, responseJson} from "~/server/utils/helper";


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
    const params = await getQuery(event)
    console.log('body',params)

    const con = getDB()
    try {
        //获取用户文章
        const [rows] = await con.query('SELECT * FROM `notes` WHERE `uid`=? LIMIT ? OFFSET ?',
            [uid,Number(params.pageSize),(Number(params.page)-1)*Number(params.pageSize)]);
        console.log('333333',rows)
        //释放连接
        await con.end()

        return  responseJson(0,'获取文章成功哦',{})
    }catch (e){
        //释放连接
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }


})
