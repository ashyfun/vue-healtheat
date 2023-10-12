import '@fortawesome/fontawesome-free/css/all.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/components'
import { aliases, fa } from 'vuetify/iconsets/fa'

const app = createApp(App),
      vuetify = createVuetify({
        components: {
          ...components,
          VDataTable,
          VDataTableServer,
          VDataTableVirtual,
        },
        directives,
        icons: {
          defaultSet: 'fa',
          aliases,
          sets: {
            fa,
          },
        },
      })

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
