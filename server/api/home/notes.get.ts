/**
 * 1、判断用户是否登录
 * 2、已登录则获取全部的文章
 */

import {getDB} from "~/server/utils/db/mysql";
import {getLoginUid, responseJson} from "~/server/utils/helper";


export default defineEventHandler(async (event)=>{

    //获取数据
    const params = await getQuery(event)


    const con = getDB()
    try {
        //获取用户文章
        const [rows] = await con.query('SELECT * FROM `notes` LIMIT ? OFFSET ?',
            [Number(params.pageSize),(Number(params.page)-1)*Number(params.pageSize)]);
        //释放连接
        await con.end()

        return  responseJson(0,'获取文章成功哦',{
            list:rows
        })
    }catch (e){
        //释放连接
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }


})
