<template>
  <a-row style="height: 100vh">
    <!--文集列表-->
    <a-col :span="4">
      <div class="notebook">
        <div class="notebook-top">
          <a-button class="go-btn" type="primary" ghost shape="round">回首页</a-button>
          <div @click="showModal" class="add-notebook"><i-mdi-plus-thick/>新建文集</div>
          <div class="create-notebook" v-if="showCreateNb">
            <a-input v-model:value="notebookName" class="notebook-input" placeholder="请输入文集名称..."></a-input>
            <div class="action-box">
              <a-button @click="addNotebook" size="small" shape="round" ghost>提交</a-button>
              <a-button @click="showCreateNb = false" style="color: #9a9a9a" type="text">取消</a-button>
            </div>
          </div>
        </div>
        <div class="notebook-center">
          <template
            v-if="notebookData.data"
            v-for="(notebookItem,notebookIndex) in notebookData.data.list"
            :key="notebookItem.id"
          >
            <div
                class="notebook-c-item "
                :class="currentNotebookIndex===notebookIndex?'active':''"
                @click="selectNotebook(notebookItem,notebookIndex)"
            >
              <span>{{notebookItem.name}}</span>
              <a-dropdown v-if="currentNotebookIndex===notebookIndex" :trigger="['click']" overlayClassName="overlayClassName">
                <a style="color: #ffffff" @click.prevent>
                  <i-ant-design-setting-filled />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="editNotebookModal(notebookItem)">
                      <a-row  type="flex" justify="center" align="middle">
                        <i-ep-edit style="margin-right: 5px"/>
                        修改文集
                      </a-row>
                    </a-menu-item>
                    <a-menu-item @click="deleteNoteBook(notebookItem)">
                      <a-row type="flex" justify="center" align="middle">
                        <i-ep-delete style="margin-right: 5px"/>
                        删除文集
                      </a-row>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>

        </div>
      </div>
    </a-col>
    <a-col :span="5" class="note-writer-list">
      <!--文章列表-->
      <div class="create" @click="createNote">
        <i-ep-circle-plus-filled/> 新建文章
      </div>
      <div class="note-create">
        <template
          v-if="notesData"
          v-for="(noteItem,noteIndex) in notesData"
          :key="noteItem.id"
        >
          <div
              class="note-create-item "
              :class="currentNoteIndex===noteIndex?'active':''"
              @click="selectNote(noteItem,noteIndex)"
          >
            <i-ph-file-text-fill class="text-icon"/>
            <span>{{noteItem.title}}</span>
            <a-dropdown v-if="currentNoteIndex===noteIndex" :trigger="['click']" overlayClassName="overlayClassName">
              <a style="color: #595959" @click.prevent>
                <i-ant-design-setting-filled />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="notePush">
                    <a-row  type="flex" justify="center" align="middle">
                      <i-mdi-share style="margin-right: 5px"/>
                      直接发布
                    </a-row>
                  </a-menu-item>
                  <a-menu-item @click="notePush">
                    <a-row  type="flex" justify="center" align="middle">
                      <i-ep-folder-opened style="margin-right: 5px"/>
                      移动文章
                    </a-row>
                  </a-menu-item>
                  <a-menu-item @click="deleteNote(noteItem)">
                    <a-row type="flex" justify="center" align="middle">
                      <i-ep-delete style="margin-right: 5px"/>
                      删除文章
                    </a-row>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </template>



      </div>
    </a-col>
    <a-col :span="15">
      <!--编辑-->
      <div class="edit-note">
        <div style="height: 80px;line-height: 80px">
          <a-input style="font-size: 30px" :bordered="false" v-model:value="name" ></a-input>
        </div>
        <Editor
            :value="content"
            :plugins="plugins"
            @change="handleChange"
            :uploadImages="uploadImages"
        />
      </div>
    </a-col>

  </a-row>
  <!--修改文集弹框-->
  <a-modal
      v-model:visible="editVisible"
      width="25%"
      title="修改文集"
      okText="提交"
      cancelText="取消"
      @ok="editNotebookHandle">
    <a-input v-model:value="cur_notebook.name" style="height: 40px" placeholder="输入文集名称"></a-input>
  </a-modal>
  <!--删除文集弹框-->
  <a-modal
      v-model:visible="deleteVisible"
      width="20%"
      okText="提交"
      cancelText="取消"
      @ok="deleteNotebookHandle">
    <div>
      <p style="margin-top: 30px">确认删除文集《{{delete_notebook.name}}》，文章将被移动到回收站。</p>
    </div>
  </a-modal>

  <!--删除文章弹框-->
  <a-modal
      v-model:visible="deleteNoteVisible"
      width="20%"
      okText="提交"
      cancelText="取消"
      @ok="deleteNoteHandle">
    <div>
      <p style="margin-top: 30px">确认删除文章《{{current_note.title}}》，文章将被移动到回收站。</p>
    </div>
  </a-modal>
</template>

<script setup>
import gfm from '@bytemd/plugin-gfm'
import {Editor} from "@bytemd/vue-next";
import 'bytemd/dist/index.css'
import {notebookFetch, noteFetch, notesFetch} from "~/composables/useHttpFetch";
const plugins = [
  gfm(),
  // Add more plugins here
]
const { $message} = useNuxtApp()


//获取文集下面的文章
const notesData = ref([])
const getNotes = async (isServer,notebookId) => {
  const {data} = await notesFetch({
    method:'GET',
    server:isServer,
    key:'notesFetch',
    params:{
      notebookId:notebookId
    }
  })
  if (data.value.code === 1) {
    throw createError({statusCode: 500,statusMessage:'服务器报错！'})
  }
  notesData.value = data.value.data.list
  getNote(true,notesData.value[0].id)
 // console.log('notesData',notesData.value)
}
//获取文集
const currentNotebookIndex = ref(0)
//当前文集id
const currentNotebookId = ref(0)
const {data:notebookData,refresh} = await notebookFetch({
  method:'GET',
  server:true,
  key:'notebookFetch'
})
if (notebookData.value.code === 1){
  throw createError({statusCode: 500,statusMessage:'服务器报错！'})
}
if (notebookData.value.data && notebookData.value.data.list.length > 0) {
  const firstNotebook = notebookData.value.data.list[0]
  currentNotebookId.value = firstNotebook.id
  getNotes(true,firstNotebook.id)
}
console.log('notebookData',notebookData)




//选中文集
const selectNotebook = (item,index) =>{
  currentNotebookIndex.value = index
  currentNotebookId.value = item.id
  notesData.value = []
  getNotes(false,item.id)
}
//新建文集
const notebookName = ref('')
const showCreateNb = ref(false)
const addNotebook = () =>{
  notebookFetch({
    method:'POST',
    body:{
      name:notebookName.value,
    },
    server:false
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    refresh()
    showCreateNb.value =false
  })
}
const showModal = () => {
  showCreateNb.value = !showCreateNb.value;
}


//修改文集
const editVisible = ref(false)
const cur_notebook = ref({})
const editNotebookModal = (item) => {
  cur_notebook.value = item
  editVisible.value = true
}

const editNotebookHandle = (e) => {
  notebookFetch({
    method:'PUT',
    body:{
      id:cur_notebook.value.id,
      name:cur_notebook.value.name
    },
    server:false,
    key:'editNotebook'
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    refresh()
    cur_notebook.value = {}
    editVisible.value = false;
  })

};

//删除文集
const deleteVisible = ref(false)
const delete_notebook = ref({})
const deleteNoteBook = (item) => {
  delete_notebook.value = item
  deleteVisible.value = true
}
const deleteNotebookHandle = () => {
  notebookFetch({
    method:'DELETE',
    body:{
      id:delete_notebook.value.id
    },
    server:false,
    key:'deleteNotebook'
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    refresh()
    deleteVisible.value = false
  })

}

//当前文章索引
const currentNoteIndex = ref(0)
//选中文章
const selectNote = (item,index) => {
  currentNoteIndex.value = index
  getNote(false,item.id)
}
//新建文章
const createNote = () => {
  noteFetch({
    method:'POST',
    body:{
      notebookId:currentNotebookId.value
    },
    server:false,
    key:'createNote'
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    getNotes(false,currentNotebookId.value)
  })
}
//删除文章
const deleteNoteVisible = ref(false)
const current_note = ref({})
const deleteNote = (item) => {
  current_note.value = item
  deleteNoteVisible.value = true
}

const deleteNoteHandle = () => {
  noteFetch({
    method:'DELETE',
    body:{
      noteId:current_note.value.id
    },
    server:false,
    key:'deleteNote'
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    $message.info('删除成功！')
    deleteNoteVisible.value = false
    getNotes(false,currentNotebookId.value)
  })
}

//根据文章id获取文章内容
const noteData = ref({})
const getNote = async (isServer,noteId) => {
  const {data} = await noteFetch({
    method:'GET',
    params:{
      noteId:noteId
    },
    server:isServer,
    key:'getNote'
  })
  if (data.value.code === 1){
    throw createError({statusCode: 500,statusMessage:'服务器报错！'})
  }
  noteData.value = data.value.data.list
  console.log('noteData',noteData.value)
}

//文章操作
//发布文章
const notePush = () => {

}

//编辑文章
const content = ref(`

### 安装Nuxt 3
\`\`\`
npx nuxi init <project-name>
\`\`\`
安装依赖项：
\`\`\`
npm install
yarn install
\`\`\`
运行 Nuxt3，安装完成后，您可以使用以下命令运行 Nuxt3：
\`\`\` shell
npm run dev
yarn dev
\`\`\`
然后，在浏览器中访问 http://localhost:3000/，您应该可以看到Nuxt3应用程序的默认欢迎页面。

### 配置Ant design Vue

#### 安装
\`\`\` shell
npm i ant-design-vue --save
yarn add ant-design-vue
\`\`\`
#### 按需配置
使用的 Vite，你可以使用 unplugin-vue-components 来进行按需加载。
\`\`\` shell
npm install unplugin-vue-components --save
yarn add unplugin-vue-components --save
\`\`\`
在nuxt.config.ts中引入
\`\`\` js
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver} from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
    vite: {
        plugins: [
            // 按需引入组件
            Components({
                resolvers: [AntDesignVueResolver()]
            })
        ],

        // ssr
        ssr: {
            noExternal: ['ant-design-vue'],
        }
    }
})
\`\`\``)
//文章名称
const name = ref('2023-03-20')
const handleChange = (e) => {
  content.value = e
  console.log('content.value',content.value)
}
//上传图片
const uploadImages = (files) => {
  console.log('files',files)
  // TODO... 上传文件的代码

  return [
    {
      title: files.map((i) => i.name),
      url: 'http' // 这里需要的是自己上传服务器返回的地址
    }
  ]
}

</script>

<style lang="scss" scoped>
.notebook{
  height: 100%;
  background-color: #404040;
  .notebook-top{
    padding: 20px;
    .go-btn{
      width: 100%;
      height: 40px;
      font-size: 16px;
    }
    .add-notebook{
      margin-top: 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .notebook-input{
      margin-top: 20px;
      background-color: #595959;
      border: none;
      height: 36px;
      color: #ffffff;
    }
    .action-box{
      margin-top: 20px;display: flex;justify-content: space-between;align-items: center
    }
  }
  .notebook-center{
    .active{
      background-color: #666666;
      border-left: 3px solid #EC7259 !important;
      padding-left: 17px !important;
    }
    .notebook-c-item{
      height: 40px;
      line-height: 40px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      &:hover{
        background-color: #666666;
      }
      span{
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

    }
  }
}
.note-writer-list{
  border-right: 1px #E8E8E8 solid;
  height: 100%;
  .create{
    padding: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #595959;
    font-size: 15px;
    border-bottom: 1px solid #E8E8E8;
    svg{
      margin-right: 6px;
    }
  }
  .note-create{
    .active{
      background-color: #E6E6E6;
      border-left: 3px #EC7259 solid;
      padding-left: 17px !important;
    }
    .note-create-item{
      border-bottom: 1px #E8E8E8 solid;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .text-icon{
        color: #BEBEBE;
        font-size: 25px;
      }
      span{
        font-size: 16px;
        color: #595959;
        margin-left: 10px;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
    }
  }

}
.edit-note{

}
</style>

<style>
.overlayClassName .ant-dropdown-content .ant-dropdown-menu{
  border-radius: 8px !important;
  width: 130px;
  padding: 10px 0 !important;
}
.notebook-top .ant-input:focus, .ant-input-focused {
  border-color: #595959;
  box-shadow: 0 0 0 2px #595959 !important;
  border-right-width: 1px !important;
  outline: 0;
}
.create-notebook .ant-btn.ant-btn-background-ghost {
  color: #42C02E;
  border-color: #42C02E;
  height: 30px;
}
.ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: none;
  border-radius: 0 0 2px 2px;
}
.ant-modal-header {
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.85);
  background: #fff;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
}

.edit-note .bytemd{
  height: calc(100vh - 80px) !important;
}

</style>
