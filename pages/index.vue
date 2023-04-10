<template>
<h1>index</h1>
  <hello-world />
  <NuxtLink to="/about">跳转到about</NuxtLink><br/>
  <NuxtLink :to="{path:'/about',query:{userInfo:JSON.stringify(userInfo)}}">带参数跳转到about</NuxtLink><br/>
  <NuxtLink to="/users-admin/8">跳转到User</NuxtLink><br/>
  <a-button @click="toAbout">跳转到about</a-button>
<!--  <h1>{{$myPlugin('World')}}</h1>-->
  <a-button type="primary" @click="info">Display normal message</a-button>
  <h1>counter:{{myStore.counter}}</h1>
  <h1>counter:{{myStore.doubleCounter}}</h1>
  <a-button @click="myStore.add()">increment</a-button>
  <br/>
  <h1>counter:{{counter}}</h1>
  <a-button @click="add()">increment</a-button>
  <i-ep-aim/>
  <i-ant-design-account-book-filled/>

</template>

<script setup>
//请求api
// const {data} = useFetch('/api/user',{server:false})

// const counter = useState('counter',()=>1)
// counter.value = 6
// const { data, pending, error, refresh } = await useFetch('https://api.nuxtjs.dev/mountains',{
//   pick: ['title'],
//   server:false
// })
//调用userInfoFetch

// const {data:userData} = await userInfoFetch({})
// console.log('userData',userData)
// const param1 = ref('value1')
// const { data, pending, error, refresh } = await useFetch('https://api.nuxtjs.dev/mountains',{
//   query: { param1, param2: 'value2' },
//   server:false
// })

const counter = useCounter()
counter.value = 10
const add = () => {
  counter.value++
}
//useCookie
const userInfoCookie = useCookie('userInfo',{maxAge:60})
userInfoCookie.value = {
  uid:123,
  username:'张三'
}

const userinfo2 = useCookie('userInfo')
console.log('userInfo',userinfo2.value)

//引入myStore
import {useMyStore} from "~/store/myStore";

const myStore = useMyStore()

const { $message } = useNuxtApp()
const info = () => {
  $message.info('This is a normal message');
};


const router = useRouter()
const userInfo = ref({
  id:1,
  username:'张三'
})
const toAbout = ()=>{
  router.push({
    path:'/about',
    query:{userInfo:JSON.stringify(userInfo.value)}
  })
}
</script>

<style scoped>

</style>
