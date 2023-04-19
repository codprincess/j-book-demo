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
                  v-if="notelistData.data"
                  v-for="(item,index) in notelistData.data.list"
                  :key="index"
              >
                <note-item :note="item" :index="index" />
              </template>

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
//获取文章列表数据

const page = ref(1)
const pageSize = ref(8)
// 是否加载
const loading = ref(false)
const {data:notelistData} = await homeNotesFetch({
  method:'GET',
  server:true,
  params:{
    page:page.value,
    pageSize:pageSize.value
  },
  key:'noteList'
})
if (notelistData.value.code === 1) {
  throw createError({statusCode:500,statusMessage:'服务器报错~~'})
}
loading.value = true

console.log(33435,notelistData)
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
