export default defineNuxtRouteMiddleware((to, from) => {
   //判断用户是否登录
    let user = true
    if (!user){
        return navigateTo('/login')
    }
})
