import Vue from 'vue'
import Title from './components/Title.vue'
import BlockLeftAndRight from './components/BlockLeftAndRight.vue'
import BlockTopBottom from './components/BlockTopBottom.vue'
import RouterTap from './components/RouterTap.vue'
import UploadCom from '@/components/uploadCom' // 提交文件
import CollegeSelect from '@/components/CollegeSelect' // 院系选择
import CollegeSelectMultiple from '@/components/CollegeSelectMultiple' // 院系多项选择
import CollegeSelectYX from '@/components/CollegeSelectYX' // 院系选择
import ProfessionSelect from '@/components/ProfessionSelect' // 专业选择
import ProfessionSelectMultiple from '@/components/ProfessionSelectMultiple' // 专业多项选择
import GradeSelect from '@/components/GradeSelect' // 年级选择
import GradeSelectMultiple from '@/components/GradeSelectMultiple' // 年级选择
import ClassSelect from '@/components/ClassSelect' // 班级选择
import ClassSelectMultiple from '@/components/ClassSelectMultiple' // 班级选择
import AreaSelect from '@/components/AreaSelect' // 區域选择
import BuildSelect from '@/components/BuildSelect' // 楼栋选择
import RoomSelect from '@/components/RoomSelect' // 班级选择
import BedSelect from '@/components/BedSelect' // 床选择
import NationSelect from '@/components/NationSelect' // 名族选择
import RoleItem from '@/components/RoleItem' // 角色权限Item
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: './static/iconfont/iconfont.js'
})
Vue.component('Title', Title)
Vue.component('BlockLeftAndRight', BlockLeftAndRight)
Vue.component('BlockTopBottom', BlockTopBottom)
Vue.component('RouterTap', RouterTap)
Vue.component('IconFont', IconFont)
Vue.component('UploadCom', UploadCom)
Vue.component('CollegeSelect', CollegeSelect)
Vue.component('CollegeSelectMultiple', CollegeSelectMultiple)
Vue.component('CollegeSelectYX', CollegeSelectYX)
Vue.component('ProfessionSelect', ProfessionSelect)
Vue.component('ProfessionSelectMultiple', ProfessionSelectMultiple)
Vue.component('GradeSelect', GradeSelect)
Vue.component('GradeSelectMultiple', GradeSelectMultiple)
Vue.component('ClassSelect', ClassSelect)
Vue.component('ClassSelectMultiple', ClassSelectMultiple)
Vue.component('AreaSelect', AreaSelect)
Vue.component('BuildSelect', BuildSelect)
Vue.component('RoomSelect', RoomSelect)
Vue.component('BedSelect', BedSelect)
Vue.component('NationSelect', NationSelect)
Vue.component('RoleItem', RoleItem)

export default Vue
