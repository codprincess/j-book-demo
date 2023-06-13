import {callWithNuxt} from "#app";

interface myFetchOptions {
    headers?: Record<string, string>

    [key: string]: any
}

const getBaseUrl = () => {
    let baseURL = ''
    if (process.env.NODE_ENV === 'production') {
        //生产环境
        if (process.server) {
            //SSR请求内网
            baseURL = 'http://127.0.0.1:3000/'
        }else {
            baseURL = 'http://jbook.XXX.com/'
        }
    }else {
        //本地开发环境
        baseURL = 'http://127.0.0.1:3000/'
    }
    return baseURL
}
export const useHttpFetch =  (url: string, opt: myFetchOptions) => {
    //token
    const accessToken = useCookie('accessToken')
    //添加请求头和token
    const headers = {
        ...opt.headers,
        ...(accessToken.value ? {Authorization: `Bearer ${accessToken.value}`} : {})
    }
    opt.headers = headers
    const nuxtApp = useNuxtApp()
    return useFetch(url, {
        ...opt,
        baseURL: getBaseUrl(),//基本url
         onRequest({request, options}) {
            console.log('request', request)
        },
         onRequestError({request, options, error}) {
            // Handle the request errors
            console.log('request', request)
        },
         async onResponse({request, response, options}) {
            // Process the response data
             //自定义处理数据
             // if (response._data.code === 0){
             //    //处理
             //     response._data = response._data.data
             // }else{
             //
             // }

        },
        async onResponseError({request, response, options}) {
            // Handle the response errors
            console.log('error', response.status)
            //https://github.com/nuxt/nuxt/issues/14771
            //未登录401状态
            if (response.status === 401) {
                await callWithNuxt(nuxtApp,navigateTo,[
                    "/sign_in",
                    {replace:true,redirectCode:401}
                ])
            }else if(response.status === 500){
                console.log('服务器报错！！')
            }
        }
    })
}

//定义接口
export const userInfoFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/user/info', opt)
}
//注册接口
export const registerFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/auth/register', opt)
}
//登录接口
export const loginFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/auth/login', opt)
}
//文集接口

export const notebookFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/note/notebook', opt)
}

//获取文章
export const notesFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/note/notes', opt)
}
//新建文章
export const noteFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/note/note', opt)
}

//文章图片上传腾讯云
export const cosAuthFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/cos/auth', opt)
}

//获取文章列表
export const homeNotesFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/home/notes', opt)
}

//获取文章详情
export const noteDetailFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/home/detail', opt)
}
//上传头像到腾讯云
export const uploadCosFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/uploadCos', opt)
}
//修改用户信息
export const editUserFetch = (opt: myFetchOptions) => {
    return useHttpFetch('/api/auth/user', opt)
}


