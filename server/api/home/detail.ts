/**
 *获取文章详情
 */

import {getDB} from "~/server/utils/db/mysql";
import {getFirstImage, responseJson, trimMarkdown} from "~/server/utils/helper";
import Joi from "joi";


export default defineEventHandler(async (event)=>{

    //获取数据
    const params = await getQuery(event)
    //校验数据joi
    const schema = Joi.object({
        noteId: Joi.number().required()
    });
    try {
        const value = await schema.validateAsync(params);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }


    const con = getDB()
    try {
        //获取用户文章
        const [notesData] = await con.query('SELECT notes.id AS id,notes.title,notes.content_md,notes.uid,notes.created_at,users.nickname,users.avatar FROM `notes` LEFT JOIN `users` ON notes.uid = users.id WHERE `state`=? AND notes.id=?',
            [2,params.noteId]);
        if (notesData.length !==1){
            return responseJson(1,'文章不存在',{})
        }


        //释放连接
        await con.end()

        return  responseJson(0,'获取文章成功哦',{
            id:notesData[0].id,
            title:notesData[0].title,
            subTitle:trimMarkdown(notesData[0].content_md,300),
            author:{
                id:notesData[0].uid,
                nickname: notesData[0].nickname,
                avatar:notesData[0].avatar
            },
            content_md:notesData[0].content_md,
            created_at:notesData[0].created_at,
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
