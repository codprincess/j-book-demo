<template>
  <h1>about</h1>
  <h1>{{route.query}}</h1>
</template>

<script setup>
const route = useRoute()
definePageMeta({
  middleware:'auth'
})

</script>

<style scoped>

</style>
