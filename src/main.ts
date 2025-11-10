import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/base.scss'
import './assets/icon/iconfont.css'
import VueCookies from 'vue-cookies'
import Request from './utils/request'
import Message from './utils/message'
import Utils from './utils/utils'
import Verify from './utils/verify'
import Confirm from './utils/confirm'
import { Api } from './utils/api'
import Collapse from '@/components/Collapse.vue'
import Dialog from '@/components/Dialog.vue'
import Cover from '@/components/Cover.vue'
import Avatar from '@/components/Avatar.vue'
import Table from '@/components/Table.vue'
import NoData from '@/components/NoData.vue'
import DataList from '@/components/DataList.vue'
import Player from '@/components/Player.vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.VueCookies = VueCookies as any
app.config.globalProperties.Request = Request as any
app.config.globalProperties.Message = Message as any
app.config.globalProperties.Utils = Utils as any
app.config.globalProperties.Verify = Verify as any
app.config.globalProperties.Confirm = Confirm as any
app.config.globalProperties.Api = Api as any
app.config.globalProperties.bodyMaxWidth = 2000
app.config.globalProperties.bodyMinWidth = 1080
app.config.globalProperties.rowCategoryCount = 15
app.config.globalProperties.chunkSize = 1024 * 512
app.config.globalProperties.maxUploading = 3
app.config.globalProperties.videoAccept = '.mp4,.avi,.rmvb,.mkv,.mov'
app.config.globalProperties.imageAccept = '.jpg,.png,.gif,.bmp,.webp'
app.config.globalProperties.imageThumbnailSuffix = '_thumbnail.jpg'
app.config.globalProperties.webDomain = 'http://localhost:3000'

// 全局组件
app.component('Collapse', Collapse)
app.component('Dialog', Dialog)
app.component('Cover', Cover)
app.component('Avatar', Avatar)
app.component('Table', Table)
app.component('NoData', NoData)
app.component('DataList', DataList)
app.component('Player', Player)
app.mount('#app')
