export const responseJson = (code:number,msg:string,data:object)=>{
    let resp = {code:code,msg:msg,data:data}
    return resp
}
export const getLoginUid = (event:any) => {
    return event.context.auth ? event.context.auth.uid : 0
}
//获取当前时间
export const genTitle = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0"+(currentDate.getMonth()+1)).slice(-2);
    let day =  ("0"+currentDate.getDay()).slice(-2);
    return year+"-"+month+"-"+day
}

//截取文章
export const trimMarkdown = (content,maxLength) => {
    let strippedContent = content.replace(/#|\*|_|`/g, '');
    if (strippedContent.length > maxLength) {
        strippedContent = strippedContent.substr(0,maxLength) + '...'
    }
    return strippedContent
}
//获取文章第一张图片
export const getFirstImage = (content) => {
    const regex = /!\[.*\]\((.*)\)/;
    const match = content.match(regex)
    if (match) {
        return match[1]
    }
    return null
}
