<template>
  <a-layout style="height: 100vh;background-color: #ffffff">
    <nav-bar/>
    <a-layout-content>
      <a-row  type="flex" justify="center" style="margin-top: 100px">
        <a-col :span="12">
          <a-row>
            <!--文章列表-->
            <a-col :span="16">
              <template
                  v-if="noteListData.data"
                  v-for="(item,index) in noteListData.data.list"
                  :key="index"
              >
                <note-item :note="item" :index="index" @like="myLike"/>
              </template>
              <a-skeleton :loading="loading" active></a-skeleton>
              <div style="text-align: center" v-if="noData">没有数据啦~~</div>
            </a-col>
            <a-col :span="1"></a-col>
            <!--右边栏-->
            <a-col :span="7">
              <banner-sider/>
              <recommend-author />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-layout-content>

    <!--回到顶部-->
    <div id="components-back-top-demo-custom">
      <a-back-top>
        <div class="ant-back-top-inner">
          <i-ant-design-arrow-up-outlined/>
        </div>
      </a-back-top>
    </div>
  </a-layout>
</template>


<script  setup>
useHead({
  title:'简书',
  meta:[
    {name:'description',content:'简书是一个优质的创作社区，在这里，你可以任性地创作，一篇短文、一张照片、一首诗、一幅画……我们相信，每个人都是生活中的艺术家，有着无穷的创造力。'},
    {name:'keywords',content:'简书,简书官网,图文编辑软件,简书下载,图文创作,创作软件,原创社区,小说,散文,写作,阅读'}
  ]
})
//获取文章列表数据

const page = ref(1)
const pageSize = ref(8)
// 是否加载
const loading = ref(false)
//无数据
const noData = ref(false)
const {data:noteListData} = await homeNotesFetch({
  method:'GET',
  server:true,
  params:{
    page:page.value,
    pageSize:pageSize.value
  },
  key:'noteList'
})
console.log('6666',noteListData)
if (noteListData.value.code === 1) {
  throw createError({statusCode:500,statusMessage:'服务器报错~~'})
}
loading.value = true


//上拉加载
const isBottom = () => {
  const scrollY = window.scrollY
  //获取页面的可视高度
  const windowHeight = window.innerHeight
  //滚动高度
  const pageHeight = document.documentElement.scrollHeight
  return (scrollY+windowHeight) >= pageHeight
}

const loadMore = () => {
  window.addEventListener('scroll',async ()=> {
    if (isBottom()) {
      loading.value = false
      page.value ++
      homeNotesFetch({
        method:'GET',
        server:false,
        params:{
          page:page.value,
          pageSize:5
        }
      }).then(({data})=>{
          console.log('4444',data)
        if (data.value.code === 1){
          throw createError({statusCode:500,statusMessage:'服务器报错~~'})
        }
        if (data.value.data.list.length < 1) {
          noData.value = true
        }
        noteListData.value.data.list.push(...data.value.data.list)
      })
    }
  })
}

onMounted(()=>{
  loadMore()
})

//模拟点赞
const myLike = (like,index,flag) => {
  if (flag){
    like = like -1
    noteListData.value.data.list[index].like = like
    noteListData.value.data.list[index].flag = false
    return
  }
  like = like + 1
  noteListData.value.data.list[index].like = like
  noteListData.value.data.list[index].flag = true
}
</script>

<style lang="scss" scoped>
#components-back-top-demo-custom .ant-back-top {
  bottom: 100px;
}
#components-back-top-demo-custom .ant-back-top-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  border: 1px solid #E05344;
  color: #E05344;
  text-align: center;
  font-size: 20px;
}
</style>
