<template>
<h1>{{msg}}</h1>
</template>

<script setup>
const props = defineProps({
  msg:{
    type:String,
    default:'Hello World!'
  }
})
</script>

<style scoped>

</style>
