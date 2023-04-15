export const useCounter = () => useState('counter',()=>1)
//用户信息
export const useUserInfo = () => useState('userInfo',()=>{
    const userInfo = useCookie('userInfo')
    return userInfo.value ? userInfo.value : null
})
