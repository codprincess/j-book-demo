<template>
  <a-layout-header class="header">
    <a-row type="flex" justify="center">
      <a-col :span="19">
        <a-row type="flex" justify="space-between">
          <a-col :span="4">
            <NuxtLink to="/">

              <img class="logo" alt="logo" src="/images/logo.png" />
            </NuxtLink>
          </a-col>
          <a-col :span="15">
            <a-row type="flex"  align="middle">
              <a-col :span="3" class="nav-item ">
                <NuxtLink to="/" class="active"> <i-mdi-compass-outline /> 发现</NuxtLink>
              </a-col>
              <a-col :span="3" class="nav-item">
                <NuxtLink to="/"> <i-ph-book-open-text /> 关注</NuxtLink>
              </a-col>
              <a-col :span="3" class="nav-item">
                <NuxtLink to="/"><i-mdi-crown />会员</NuxtLink>
              </a-col>
              <a-col :span="3" class="nav-item">
                <NuxtLink to="/"><i-mdi-file-code-outline />IT技术</NuxtLink>
              </a-col>
              <a-col :span="3" class="nav-item">

                <NuxtLink to="/"><i-mdi-bell-ring-outline />消息</NuxtLink>
              </a-col>
              <a-col :span="7" class="nav-item">
                <a-row type="flex" class="search-box">
                  <a-input :bordered="false" placeholder="搜索">
                    <template #suffix>
                      <a-tooltip title="Extra information">
                        <i-ep-search />
                      </a-tooltip>
                    </template>
                  </a-input>
                </a-row>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="5">
            <a-row type="flex" justify="space-around">
              <a-col>
                <div v-if="!userInfo">
                  <a-button @click="signIn" type="text">登录</a-button>
                  <a-button @click="signUp" shape="round" ghost type="primary">注册</a-button>
                </div>
                <a-dropdown v-else>
                  <div class="avatar">
                    <a-avatar :size="40">
                      <template #icon>
                        <img :src="userInfo?userInfo.avatar:'/images/default-avatar.png'" alt="avatar">
                      </template>
                    </a-avatar>
                    <i-ant-design-caret-down-filled/>
                  </div>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <NuxtLink class="select-user"><i-ant-design-user-outlined /> 我的主页</NuxtLink>
                      </a-menu-item>
                      <a-menu-item>
                        <NuxtLink class="select-user"><i-ep-collection-tag /> 收藏文章</NuxtLink>
                      </a-menu-item>
                      <a-menu-item>
                        <NuxtLink to="/user/settings" class="select-user"><i-ep-setting /> 设置</NuxtLink>
                      </a-menu-item>
                      <a-menu-item @click="logout">
                        <NuxtLink class="select-user"><i-ant-design-logout-outlined /> 退出</NuxtLink>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-col>
              <a-col>
                <a-button @click="go" shape="round" type="primary" style="height: 40px;font-size: 16px">
                  <i-mdi-feather style="margin-right: 4px;font-size: 16px;vertical-align: middle;" />
                  写文章
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script lang="ts" setup>

const userInfo = useUserInfo().value
const go = () => {
  navigateTo('/note/writer')
}
//退出登录
const logout = () => {
  const useUserInfoCookie = useCookie('userInfo')
  useUserInfoCookie.value = ''
  window.location.reload()
}
const signIn = () => {
  navigateTo('/sign_in')
}
const signUp = () => {
  navigateTo('/sign_up')
}
</script>

<style lang="scss" scoped>
.header{
  background-color: #ffffff;
  border-bottom: 1px solid #F0F0F0;
  height: 56px !important;
  line-height: 56px !important;
  position: fixed;
  width: 100%;
  z-index: 99;
  .logo{
    height:30px;
  }
  .nav-item{
    font-size: 18px;
    a{
      color: #333333;
      display: flex;
      align-items: center;
      svg{
        margin-right: 4px;
      }
    }
    .active{
      color: #ea6f5a !important;
    }
    .search-box{
      border-radius: 30px;
      background-color: #EEEEEE;
      height: 40px;
      padding: 0 10px;
    }
  }
  .avatar {
    svg {
      font-size: 12px;
      color: #999999;
    }
  }
}

</style>

<style lang="scss">
.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
  padding: 15px 50px 15px 20px;
}
.select-user {
  display: flex;
  align-items: center;
  color: #333;
  svg{
    color: #E05344;
    margin-right: 15px;
    font-size: 18px;
  }
}
</style>
