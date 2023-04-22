<template>
  <nav-bar/>
  <a-row type="flex" justify="center" style="background-color: #F9F9F9;min-height:100vh;padding-top: 66px">
    <a-col :span="15" >
      <a-row>
        <a-col :span="2">
          <div class="left-sider">
            <div class="like-btn">
              <div class="icon-item"><i-ant-design-like-filled/></div>
              <p>10赞</p>
            </div>
            <div class="like-btn">
              <div class="icon-item">赏</div>
              <p>赞赏</p>
            </div>
            <div class="like-btn">
              <div class="icon-item"><i-ant-design-qrcode-outlined/></div>
              <p>更多好文</p>
            </div>
          </div>

        </a-col>
        <a-col :span="16" class="note-content">
          <div class="author-box">
            <h1>{{noteData.title}}</h1>
            <div class="author-info">
              <NuxtLink>
                <a-avatar :size="44">
                  <template #icon>
                    <img :src="noteData.author.avatar?noteData.author.avatar:'/images/default-avatar.png'" alt="avatar">
                  </template>
                </a-avatar>
              </NuxtLink>
              <div class="author-des">
                <a-row type="flex" align="middle">
                  <span>{{noteData.author.nickname}}</span>
                  <i-mdi-clover style="color: #00BB29"/>
                  <a-button style=" height: 22px;padding: 0 6px;font-size: 12px;margin-left: 6px" shape="round" size="small" danger>关注</a-button>
                  <span class="ip">IP属地：上海</span>
                </a-row>
                <a-row type="flex" align="middle" style="margin-top: 6px">
                  <span class="jsd-meta"><i-ion-diamond/>136.0</span>
                  <span class="ip">{{moment(noteData.created_at).format('YYYY-MM-DD:HH:mm:ss')}}</span>
                  <span class="ip">字数 310</span>
                  <span class="ip">阅读 420</span>
                </a-row>
              </div>

            </div>
          </div>
          <Viewer :value="noteData.content_md" :plugins="plugins" />
        </a-col>
        <a-col :span="6" class="right-sider">
          <div class="right-author">
            <div class="author-des" style="border-bottom: 1px solid #f0f0f0;padding-bottom: 10px">
              <a-row type="flex" align="middle">
                <span style="flex: 1">干物妹小埋</span>
                <a-button style=" height: 22px;padding: 0 6px;font-size: 12px;margin-left: 6px" shape="round" size="small" danger>关注</a-button>
              </a-row>
              <a-row type="flex" align="middle" style="margin-top: 6px">
                <span class="ip">总资产 310</span>
              </a-row>
            </div>
            <div class="author-note">
              <div class="author-note-item">
                <NuxtLink>怎么样才能实现暴富</NuxtLink>
                <p class="read">阅读 5349</p>
              </div>
              <div class="author-note-item">
                <NuxtLink>Nuxt3开发注意事项，新手必看文章，看完就学会</NuxtLink>
                <p class="read">阅读 5349</p>
              </div>
              <div class="author-note-item">
                <NuxtLink>怎么才是财富自由</NuxtLink>
                <p class="read">阅读 5349</p>
              </div>
            </div>
          </div>
          <div class="hot-note">
            <h3>热门文章</h3>
            <div class="author-note">
              <div class="author-note-item" style="margin-bottom: 10px">
                <NuxtLink>怎么样才能实现暴富</NuxtLink>
              </div>
              <div class="author-note-item" style="margin-bottom: 10px">
                <NuxtLink>Nuxt3开发注意事项，新手必看文章，看完就学会</NuxtLink>
              </div>
              <div class="author-note-item" style="margin-bottom: 10px">
                <NuxtLink>怎么才是财富自由</NuxtLink>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup>
import gfm from "@bytemd/plugin-gfm";
import {Viewer} from "@bytemd/vue-next";
import 'bytemd/dist/index.css'
import 'assets/css/github-markdown-light.css'
import highlight from '@bytemd/plugin-highlight'
import 'highlight.js/styles/routeros.css'
import moment from 'moment'

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
]
const noteData = ref({})

const route = useRoute()
const {data} = await noteDetailFetch({
  method:'GET',
  server:true,
  params:{
    noteId:route.params.id
  }
})
if (data.value.code === 1){
  throw createError({statusCode:500,statusMessage:'服务器错误'})
}
noteData.value = data.value.data
console.log(33333,noteData.value)
useHead({
  title:noteData.value.title,
  meta:[
    {name:'description',content:noteData.value.subTitle},
    {name:'keywords',content:noteData.value.subTitle}
  ]
})

</script>

<style lang="scss" scoped>
.left-sider{
  position: fixed;
  z-index: 98;
  top: 216px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  left: calc((100vw - 1000px)/2 - 86px);
  .like-btn{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #969696;
    .icon-item{
      background-color: #ffffff;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,.05);
      margin-bottom: 5px;
      cursor: pointer;
    }
  }
}
.note-content{
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px;
  h1{
    font-weight: bold;
  }
  .author-box{
    margin-bottom: 30px;
    .author-info{
      display: flex;
      margin-top: 30px;
      .author-des{
        margin-left: 10px;
        span{
          font-size: 16px;
          font-weight: 500;
          margin-right: 8px;
        }
        .ip{
          color: #9a9a9a;
          font-size: 12px;
          margin-left: 6px;
        }
        .jsd-meta,{
          color: #E05344;
          display: flex;
          align-items: center;
          margin-right: 6px;
          font-size: 12px;
        }
      }
    }
  }
}

.right-sider{
  .right-author{
    border-radius: 6px;
    background-color: #ffffff;
    margin-left: 15px;
    padding: 15px;
    .author-des{
      span{
        font-size: 16px;
        font-weight: 500;
      }
      .ip{
        color: #9a9a9a;
        font-size: 12px;
      }
    }
  }
  .author-note{
    margin-top: 15px;
    .author-note-item{
      a{
        display: block;
        font-size: 14px;
        line-height: 22px;
        color: #2d2d2d;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        &:hover{
          text-decoration: underline;
        }
      }
      .read{
        color: #9a9a9a;
        font-size: 12px;
      }
    }
  }
  .hot-note{
    border-radius: 6px;
    background-color: #ffffff;
    margin-left: 15px;
    padding: 15px;
    margin-top: 20px;
    h3{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-left: 4px solid #ec7259;
      font-weight: 500;
      padding-left: 6px;
    }
  }
}
</style>
