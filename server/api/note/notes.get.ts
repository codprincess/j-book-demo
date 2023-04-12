/**
 * 1、判断用户是否登录
 * 2、已登录则获取用户文集下的文章
 */

import {getDB} from "~/server/utils/db/mysql";
import {getLoginUid, responseJson} from "~/server/utils/helper";
import Joi from "joi";


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
    //校验数据joi
    const schema = Joi.object({
        notebookId: Joi.number().required()
    });
    try {
        const value = await schema.validateAsync(params);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }

    const con = getDB()
    try {
        //查询文章和文集的关联表
        const [notebookRows] = await con.query('SELECT `note_id` FROM `notebook_notes` WHERE `notebook_id`=?',
            [params.notebookId]);
        console.log('notebookRows',notebookRows)

        //查询文章
        let noteIdList:any = []
        //遍历文章id
        notebookRows.map((v:any)=>{
            noteIdList.push(v.note_id)
        })
        //查询文章表
        const [notesRows] = await con.query('SELECT id,title FROM `notes` WHERE `uid`=? AND id IN (?) ORDER BY `id` DESC',
            [uid,noteIdList]);
        console.log('notesRows',notesRows)
        //释放连接
        await con.end()

        return  responseJson(0,'获取文章成功哦',{
            list:notesRows
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
