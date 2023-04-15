// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite'
import {
    AntDesignVueResolver
} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
    runtimeConfig:{
      //私密
        SecretId:process.env.SECRET_ID,
        SecretKey:process.env.SECRET_KEY,
        public:{
            //公开
            BUCKET: process.env.BUCKET,
            REGION: process.env.REGION,
        }
    },
    modules:['@pinia/nuxt','@pinia-plugin-persistedstate/nuxt'],
    vite: {
        plugins: [
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle:'less'
                    }),
                    IconsResolver({
                        prefix:'i',
                        enabledCollections:['ep','ant-design','mdi','ph']
                    })
                ],

            }),
            Icons({
                autoInstall: true
            })

        ],
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        'primary-color': '#ea6f5a',
                    },
                    javascriptEnabled: true,
                }
            }
        },
        ssr:{
            noExternal:['ant-design-vue']
        }
    },
})
