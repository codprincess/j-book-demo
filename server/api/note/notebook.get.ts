/**
 * 1、判断用户是否登录
 * 2、已登录则获取用户的文集
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


    const con = getDB()
    try {
        //获取用户文集
        const [rows] = await con.execute('SELECT * FROM `notebooks` WHERE `uid`=? ORDER BY `id` DESC',
            [uid]);
        console.log('333333',rows)
        //释放连接
        await con.end()

        return  responseJson(0,'获取文集成功哦',{
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
