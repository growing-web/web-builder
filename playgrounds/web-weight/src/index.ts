import Vue from 'vue'
import createWidgetApp from '@web-widget/web-widget-vue'
import App from './App.vue'
// import router from './router';

export default createWidgetApp({
  Vue,
  styles: App.styles,
  vueOptions(props) {
    return {
      provide: {
        host: props,
      },
      render(h) {
        return h(App, {
          // ...
        })
      },
      // router
    }
  },
})
