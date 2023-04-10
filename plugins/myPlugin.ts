export default defineNuxtPlugin(()=>{
    return {
        provide: {
            myPlugin:(msg:string) => `Hello ${msg}`
        }
    }
})
