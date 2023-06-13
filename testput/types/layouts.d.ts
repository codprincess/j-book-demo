import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/Users/hedy/Projects/j-book/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}