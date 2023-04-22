/**
 * 1、判断用户是否登录
 * 2、已登录则获取全部的文章
 */

import {getDB} from "~/server/utils/db/mysql";
import {getFirstImage, getLoginUid, responseJson, trimMarkdown} from "~/server/utils/helper";


export default defineEventHandler(async (event)=>{

    //获取数据
    const params = await getQuery(event)


    const con = getDB()
    try {
        //获取用户文章
        const [notesData] = await con.query('SELECT notes.id AS id,notes.title,notes.content_md,notes.uid,users.nickname FROM `notes` LEFT JOIN `users` ON notes.uid = users.id WHERE `state`=? LIMIT ? OFFSET ?',
            [2,Number(params.pageSize),(Number(params.page)-1)*Number(params.pageSize)]);
        notesData.map((v:any)=>{
            v.subTitle = trimMarkdown(v.content_md,300)
            v.cover = getFirstImage(v.content_md)
            v.like = 45
            v.content_md = ''
            v.flag = false

        })

        //释放连接
        await con.end()

        return  responseJson(0,'获取文章成功哦',{
            list:notesData
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
