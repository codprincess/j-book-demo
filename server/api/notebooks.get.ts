
import {getDB} from "~/server/utils/db/mysql";
import {getLoginUid, responseJson} from "~/server/utils/helper";


export default defineEventHandler(async (event)=>{

    const con = getDB()
    try {
        //获取用户文集
        const [rows] = await con.execute('SELECT * FROM `notebooks`');
        console.log('333333',rows)
        //释放连接
        await con.end()

        return  responseJson(0,'ok',{})
    }catch (e){
        //释放连接
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }


})
