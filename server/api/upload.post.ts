/**
 * 1、判断用户是否登录
 * 2、上传头像
 */

import Joi from "joi";
import {getDB} from "~/server/utils/db/mysql";
import { getLoginUid, responseJson} from "~/server/utils/helper";
import path from "path";
import * as fs from "fs";



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
    const body = await readMultipartFormData(event)
    console.log('11111',body)

    if (body ){
        if (body[0].type !== 'image/jpeg' && body[0].type !== 'image/png' && body[0].type !== 'image/jpg') {
            return responseJson(1,'请上传jpg/png/jpeg类型的图片',{})
        }
        //图片名称
        const fileName = Date.now()+'-'+body[0].filename
        //图片路径
        const filePath = path.join('./public','img',fileName)
        //图片数据
        const buffer = body[0].data

        fs.writeFile(filePath,buffer,(err)=>{
            if (err) {
                console.log(err)
            }else {

            }
        })

        //存储图片路径
        const avatarUrl = '/img/'+fileName

        const con = getDB()
        try {
            //插入users
            const [rows] = await con.execute('UPDATE `users` SET `avatar`=? WHERE `id`=?',
                [avatarUrl,uid]);
            //释放连接
            await con.end()
            if (rows.affectedRows === 0){
                return  responseJson(1,'上传头像失败~',{})
            }
            return  responseJson(0,'ok~',{
                avatar:avatarUrl
            })

        }catch (e){
            //释放连接
            await con.end()
            console.log('error',e)
            // @ts-ignore
            setResponseStatus(event,500)
            return responseJson(1,'服务器错误',{})
        }

    }

    return  responseJson(1,'请上传头像~',{})


})
