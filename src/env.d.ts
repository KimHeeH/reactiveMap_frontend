/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "*.svg" {
  import { DefineComponent } from "vue";
  const content: DefineComponent<{}, {}, any>;
  export default content;
}
interface ImportMeta {
  readonly env: {
    [key: string]: string;
  };
}
