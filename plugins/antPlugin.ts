import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css';
export default defineNuxtPlugin(()=>{
    return {
        provide: {
            message:message
        }
    }
})

