<template>
  <nav-bar></nav-bar>
  <a-row type="flex" justify="center" class="settings">
    <a-col :span="12">
      <a-row>
        <a-col :span="7" class="aside">
          <div class="user-link-item active">
            <i-mdi-list-box/>
            <span>基础设置</span>
          </div>
          <div class="user-link-item ">
            <i-mdi-account-box/>
            <span>个人资料</span>
          </div>
          <div class="user-link-item ">
            <i-mdi-alpha-b-box/>
            <span>黑名单</span>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="setting-base">
            <div class="settings-list">
              <div class="item-line">
                <a-avatar :size="85">
                  <template #icon>
                    <img :src="user.avatar?user.avatar:'/images/default-avatar.png'" alt="avatar">
                  </template>
                </a-avatar>
              </div>
              <div>
                <!--                <a-button  shape="round" ghost>更改头像</a-button>-->
                <a-upload
                    name="avatar"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                >
                  <a-button  shape="round" ghost>更改头像</a-button>
                </a-upload>
              </div>
            </div>
            <div class="settings-list border-b">
              <div class="item-line">
                <span>昵称</span>
              </div>
              <div class="nickname">
                <a-input v-model:value="user.nickname" style="background-color: #F7F7F7;" :bordered="false" placeholder="输入昵称"></a-input>
              </div>
            </div>
            <div class="settings-list border-b">
              <div class="item-line">
                <span>电子邮件</span>
              </div>
              <div >
                71*****47@qq.com
              </div>
            </div>
            <div class="settings-list border-b">
              <div class="item-line">
                <span>手机</span>
              </div>
              <div >
                152****1073
              </div>
            </div>
            <div  class="save-btn">
              <a-button  @click="editUser" shape="round" ghost>保存</a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup>
import {uploadCosFetch} from "~/composables/useHttpFetch";

const user = ref({})
user.value = useUserInfo().value
const { $message } =  useNuxtApp()

useHead({
  title:user.value.nickname,
  meta:[
    {name:'description',content:'简书是一个优质的创作社区，在这里，你可以任性地创作，一篇短文、一张照片、一首诗、一幅画……我们相信，每个人都是生活中的艺术家，有着无穷的创造力。'},
    {name:'keywords',content:'简书,简书官网,图文编辑软件,简书下载,图文创作,创作软件,原创社区,小说,散文,写作,阅读'}
  ]
})
//上传头像
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' ;
  if (!isJpgOrPng) {
    $message.error('请选择正确的图片类型');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    $message.error('图片大小不能超过2MB!');
  }
  const formData = new FormData()
  formData.append('avatar',file)
  uploadCosFetch({
    method:'POST',
    body:formData,
    key:'uploadCosFetch',
    server:false
  }).then(({data}) => {
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    console.log('data',data)
    user.value.avatar = data.value.data.avatar
    const userInfo = useCookie('userInfo',{maxAge:60*60*24*7})
    userInfo.value.avatar = user.value.avatar
  })
}

//修改用户资料
const editUser = () => {
  editUserFetch({
    method: 'PUT',
    body:{
      nickname:user.value.nickname
    },
    key:'editUserFetch',
    server:false
  }).then(({data})=>{
    if (data.value.code === 1){
      $message.error(data.value.msg)
      return
    }
    $message.success(data.value.msg)
    console.log('data',data)
    const userInfo = useCookie('userInfo',{maxAge:60*60*24*7})
    userInfo.value.nickname = user.value.nickname
  })
}
</script>

<style lang="scss" scoped>
.settings{
  padding-top: 80px;
  .aside{
    margin-top: 20px;
    .active{
      background-color: #F0F0F0;
      border-radius: 5px;
    }
    .user-link-item{
      padding: 5px 10px;
      display: flex;
      align-items: center;
      &:hover{
        background-color: #F0F0F0;
        border-radius: 5px;
      }
      svg{
        color: #A0A0A0;
        font-size: 32px;
      }
      span{
        font-size: 16px;
        margin-left: 12px;
        color: #333333;
      }
    }
  }
  .setting-base{
    margin-left: 50px;
    .border-b{
      border-bottom: 1px #F0F0F0 solid;
    }
    .settings-list{
      display: flex;
      align-items: center;
      padding: 20px 0;
      .item-line{
        width: 150px;
        span{
          font-size: 15px;
          color: #969696;
        }
      }
      .nickname{
        background-color: #F7F7F7; border: 1px solid #c8c8c8;border-radius: 6px;padding: 2px;
      }

    }
  }
}
</style>
<style>
.settings-list .ant-btn.ant-btn-background-ghost {
  color: #42C02E;
  border-color: #42C02E;
  height: 36px;
}
.save-btn .ant-btn.ant-btn-background-ghost{
  margin-top: 30px;
  color: #ffffff;
  border-color: #42C02E;
  background-color: #00BB29;
  height: 32px;

}
</style>
