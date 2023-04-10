import {callWithNuxt} from "#app";

interface myFetchOptions {
    headers?: Record<string, string>

    [key: string]: any
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
        baseURL: 'http://localhost:3000/',//基本url
         onRequest({request, options}) {
            console.log('request', request)
        },
         onRequestError({request, options, error}) {
            // Handle the request errors
            console.log('request', request)
        },
         onResponse({request, response, options}) {
            // Process the response data
            console.log('request', response)
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


