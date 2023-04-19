<template>
  <a-row>
    <div class="recommended-authors">
      <div class="title">
        <span>推荐作者</span>
        <NuxtLink><i-ep-refresh/>换一批</NuxtLink>
      </div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in [1,2,3,4,5]">
          <NuxtLink>
            <a-avatar :size="44">
              <template #icon>
                <img src="/images/default-avatar.png" alt="avatar">
              </template>
            </a-avatar>
          </NuxtLink>
          <div class="authors-info">
            <div class="authors-name">
              <span>小埋</span>
              <NuxtLink>+ 关注</NuxtLink>
            </div>
            <p>写了269.3k字 · 31.6k喜欢</p>
          </div>
        </div>
      </div>
    </div>
  </a-row>

</template>

<script>

</script>

<style lang="scss" scoped>
.recommended-authors{
  width: 100%;
  margin-top: 30px;
  .title{
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #b4b4b4;
    a{
      display: flex;
      align-items: center;
      color: #b4b4b4;
      &:hover{
        color: #333333;
      }
    }
  }
  .list{
    margin-top: 30px;
    .list-item{
      display: flex;
      margin-bottom: 10px;
      .authors-info{
        margin-left: 10px;
        flex: 1;
        .authors-name{
          display: flex;
          justify-content: space-between;
          a{
            color: #00BB29;
          }
        }
        p{
          margin-top: 2px;
          font-size: 12px;
          color: #969696;
        }
      }
    }
  }
}
</style>
