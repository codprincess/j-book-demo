<template>
  <a-row class="note-item"
         v-if="props.note"
  >
    <a-col :span="props.note.cover?17:23">
      <NuxtLink :to="{path:'/p/'+props.note.id}" class="title">{{props.note.title}}</NuxtLink>
      <p class="abstract"> {{props.note.subTitle}}</p>
      <a-row class="meta">
        <a-col class="jsd-meta"><i-ion-diamond/>136.0</a-col>
        <NuxtLink class="nickname">{{props.note.nickname}}</NuxtLink>
        <NuxtLink class="comments"><i-mdi-message/> 10</NuxtLink>
        <NuxtLink class="like" @click="likeClick">
          <i-mdi-cards-heart :style="{color:props.note.flag?'red':''}" />{{props.note.like}}
        </NuxtLink>
      </a-row>
    </a-col>
    <a-col :span="1"></a-col>
    <a-col :span="6" v-if="props.note.cover">
      <NuxtLink :to="{path:'/p/'+props.note.id}" class="note-img" style="">
        <img   :src="props.note.cover" alt="cover" >
      </NuxtLink>
    </a-col>
  </a-row>
</template>

<script setup>
const props = defineProps(["note","index"])


const emit = defineEmits(['like'])
//模拟点赞
function likeClick(){
  emit('like',props.note.like,props.index,props.note.flag)
}
const lists = reactive({
  data:[
    {id:1,item:'item 1'},
    {id:2,item:'item 2'},
    {id:3,item:'item 3'},
    {id:4,item:'item 4'},
    {id:5,item:'item 5'},
    {id:1,item:'item 1'},
    {id:2,item:'item 2'},
    {id:3,item:'item 3'},
    {id:4,item:'item 4'},
    {id:5,item:'item 5'},
  ]
})
</script>

<style lang="scss" scoped>
.note-item{
  border-bottom: 1px #F0F0F0 solid;
  padding-bottom: 25px;
  margin-bottom: 30px;
  .title{
    margin: -7px 0 4px;
    display: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    color: #333333;
    &:hover{
      text-decoration: underline;
    }
  }
  .abstract{
    margin: 0 0 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .note-img{
    width: 100%;height: 100px;display: block;
    img{
      overflow: clip; border-radius: 4px;height: 100%;width: 100%;vertical-align: middle;object-fit: cover;
    }
  }
  .meta{
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    svg{
      font-size: 11px;
    }
    .jsd-meta,{
      color: #E05344;
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    a{
      color: #b4b4b4;
      &:hover{
        color: #333333;
      }
    }
    .comments,.like{
      display: flex;
      align-items: center;
      margin-left: 10px;
    }

  }
}
</style>
