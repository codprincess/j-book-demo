import Joi from "joi";
import {getLoginUid, responseJson} from "~/server/utils/helper";
import {getDB} from "~/server/utils/db/mysql";

/***
 * 创建文集
 */
export default defineEventHandler(async (event) => {
    //获取用户id，判断是否登录
    let uid = getLoginUid(event)
    if (uid === 0 ) {
        // @ts-ignore
        setResponseStatus(event, 401)
        return responseJson(1,'请先登录',{})
    }
    //获取数据
    const body = await readBody(event)
    // 数据校验
    const schema = Joi.object({
        name: Joi.string().required()
    })
    try {
        const value = await schema.validateAsync(body)
    } catch (e) {
        return responseJson(1, '参数错误', {});
    }
    const con = getDB()
    try {
        //创建文集
        const [rows] = await con.
        execute('insert into `notebooks` (`name`,`uid`) value (?,?)',[body.name,uid])
        await con.end()
        if (rows.affectedRows === 0) {
            return responseJson(1,'创建失败',{})
        }
        return responseJson(0,'ok',{})
        //释放连接

    }catch (e){
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }

})
