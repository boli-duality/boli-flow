import { Directive } from 'vue'

interface VVisibleElement extends HTMLElement {
  [vVisibleOriginalStyle]: string
}
declare module 'vue' {
  export interface GlobalDirectives {
    vVisible: Directive<VVisibleElement, boolean>
  }
}
