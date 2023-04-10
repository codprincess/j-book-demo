import {defineStore} from "pinia";

export const useMyStore = defineStore('myStore',{
    state:()=>({
        counter:1,
        token:'2423534543'
    }),
    getters:{
        doubleCounter:(state) => state.counter * 2
    },
    actions:{
        add(){
            this.counter++
        }
    },
})
