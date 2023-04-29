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
        DB_HOST:process.env.DB_HOST,
        DB_USER:process.env.DB_USER,
        DB_DATABASE:process.env.DB_DATABASE,
        DB_PASSWORD:process.env.DB_PASSWORD,
        public:{
            //公开
            BUCKET: process.env.BUCKET,
            REGION: process.env.REGION,
        }
    },
    modules:['@pinia/nuxt','@pinia-plugin-persistedstate/nuxt'],
    vite: {
        esbuild : {
          drop: process.env.NODE_ENV === 'production' ? ['console','debugger'] :[]
        },
        build :{
          minify: 'esbuild',
          chunkSizeWarningLimit: 500,
          cssCodeSplit: true
        },
        plugins: [
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle:'less'
                    }),
                    IconsResolver({
                        prefix:'i',
                        enabledCollections:['ep','ant-design','mdi','ph','ion']
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
    }
})
