import Vue from 'vue'
import Router from 'vue-router'

// 主要页面
const Login = () => import('@/pages/Login/Login')
const MainPage = () => import('@/pages/MainPage/MainPage')

// 内容区域
// 首页
const Institute = () => import('@/pages/MainPage/ContentPage/IndexPage/Institute/Institute')
const Assistant = () => import('@/pages/MainPage/ContentPage/IndexPage/Assistant/Assistant')
const HouseMaster = () => import('@/pages/MainPage/ContentPage/IndexPage/HouseMaster/HouseMaster')

// 归寝管理
const ActualTimeCheckSleep = () => import('@/pages/MainPage/ContentPage/DormitoryManagement/ActualTimeCheckSleep/ActualTimeCheckSleep')
const GuiaiCheckSleep = () => import('@/pages/MainPage/ContentPage/DormitoryManagement/GuiaiCheckSleep/GuiaiCheckSleep')
const RuleCheckSleep = () => import('@/pages/MainPage/ContentPage/DormitoryManagement/RuleCheckSleep/RuleCheckSleep')

// // 记录查询
const ComeGoNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/ComeGoNotes/ComeGoNotes')
const AttendanceDetails = () => import('@/pages/MainPage/ContentPage/RecordQuery/ComeGoNotes/AttendanceDetails')
const VistorNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/VistorNotes/VistorNotes')
const PliceNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/PliceNotes/PliceNotes')
const ApplicationNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/ApplicationNotes/ApplicationNotes')
const BreakRuleNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/BreakRuleNotes/BreakRuleNotes')
const StrangerNotes = () => import('@/pages/MainPage/ContentPage/RecordQuery/stranger/StrangerNotes')

// // 数据中心
const dormitory = () => import('@/pages/MainPage/ContentPage/dataCenter/dormitory/dormitory')
const dormitoryBedDetails = () => import('@/pages/MainPage/ContentPage/dataCenter/dormitory/dormitoryBedDetails/dormitoryBedDetails')
const FirstStep = () => import('@/pages/MainPage/ContentPage/dataCenter/dormitory/dormitoryBedDetails/FirstStep')
const SeconseStep = () => import('@/pages/MainPage/ContentPage/dataCenter/dormitory/dormitoryBedDetails/SeconseStep')
const ThredStep = () => import('@/pages/MainPage/ContentPage/dataCenter/dormitory/dormitoryBedDetails/ThredStep')
const manageClass = () => import('@/pages/MainPage/ContentPage/dataCenter/managementClass/manageClass')
const manageClassSeting = () => import('@/pages/MainPage/ContentPage/dataCenter/managementClass/manageClassSeting/manageClassSeting')
const personnel = () => import('@/pages/MainPage/ContentPage/dataCenter/people/personnel')
const Notice = () => import('@/pages/MainPage/ContentPage/dataCenter/Notice/Notice')
const NoticeAdd = () => import('@/pages/MainPage/ContentPage/dataCenter/Notice/NoticeAdd')
const NoticeUpData = () => import('@/pages/MainPage/ContentPage/dataCenter/Notice/NoticeUpData')
const FastMale = () => import('@/pages/MainPage/ContentPage/dataCenter/FastMale/FastMale')
const EquipmentManagement = () => import('@/pages/MainPage/ContentPage/dataCenter/EquipmentManagement/EquipmentManagement')

// // 系统
const Role = () => import('@/pages/MainPage/ContentPage/SysSeting/Role/Role')
const Account = () => import('@/pages/MainPage/ContentPage/SysSeting/Account/Account')

// // 消息中心
const MessageCenter = () => import('@/pages/MessageCenter/MessageCenter')

// 自动登录
const AutoLogin = () => import('@/pages/Login/AutoLogin')

// 人脸检索
const FaceRetrieval = () => import('@/pages/MainPage/ContentPage/FaceRetrieval/index')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/auto',
      redirect: '/auto/login'
    },
    {
      path: '/auto/login',
      name: 'autoLogin',
      component: AutoLogin
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/mainPage',
      name: 'MainPage',
      component: MainPage,
      children: [
        {
          path: '/mainPage',
          redirect: '/mainPage/institute'
        },
        {
          path: '/mainPage/institute',
          name: 'Institute',
          component: Institute
        },
        {
          path: '/mainPage/face',
          name: 'face',
          component: FaceRetrieval
        },
        {
          path: '/mainPage/assistant',
          name: 'Assistant',
          component: Assistant
        },
        {
          path: '/mainPage/houseMaster',
          name: 'HouseMaster',
          component: HouseMaster
        },
        {
          path: '/mainPage/messageCenter',
          name: 'MessageCenter',
          component: MessageCenter
        },
        {
          path: '/mainPage/manageClassSeting',
          name: 'ManageClassSeting',
          component: manageClassSeting
        },
        {
          path: '/mainPage/actualTimeCheckSleep',
          name: 'ActualTimeCheckSleep',
          component: ActualTimeCheckSleep
        },
        {
          path: '/mainPage/guiaiCheckSleep',
          name: 'GuiaiCheckSleep',
          component: GuiaiCheckSleep
        },
        {
          path: '/mainPage/ruleCheckSleep',
          name: 'RuleCheckSleep',
          component: RuleCheckSleep
        },
        {
          path: '/mainPage/comeGoNotes/:id',
          name: 'ComeGoNotes',
          component: ComeGoNotes
        },
        {
          path: '/mainPage/AttendanceDetails',
          name: 'AttendanceDetails',
          component: AttendanceDetails
        },
        {
          path: '/mainPage/vistorNotes',
          name: 'VistorNotes',
          component: VistorNotes
        },
        {
          path: '/mainPage/pliceNotes/:id',
          name: 'PliceNotes',
          component: PliceNotes
        },
        {
          path: '/mainPage/applicationNotes/:id',
          name: 'ApplicationNotes',
          component: ApplicationNotes
        },
        {
          path: '/mainPage/breakRuleNotes',
          name: 'BreakRuleNotes',
          component: BreakRuleNotes
        },
        {
          path: '/mainPage/stranger',
          name: 'stranger',
          component: StrangerNotes
        },
        {
          path: '/mainPage/personnel/:id',
          name: 'personnel',
          component: personnel
        },
        {
          path: '/mainPage/notice',
          name: 'Notice',
          component: Notice
        },
        {
          path: '/mainPage/noticeAdd',
          name: 'NoticeAdd',
          component: NoticeAdd
        },
        {
          path: '/mainPage/noticeUpData',
          name: 'NoticeUpData',
          component: NoticeUpData
        },
        {
          path: '/mainPage/fastMale',
          name: 'FastMale',
          component: FastMale
        },
        {
          path: '/mainPage/Role',
          name: 'Role',
          component: Role
        },
        {
          path: '/mainPage/dormitoryBedDetails',
          name: 'dormitoryBedDetails',
          component: dormitoryBedDetails,
          children: [
            {
              path: '/mainPage/dormitoryBedDetails',
              redirect: '/mainPage/dormitoryBedDetails/FirstStep'
            },
            {
              path: '/mainPage/dormitoryBedDetails/FirstStep',
              name: 'FirstStep',
              component: FirstStep
            },
            {
              path: '/mainPage/dormitoryBedDetails/SeconseStep',
              name: 'SeconseStep',
              component: SeconseStep
            },
            {
              path: '/mainPage/dormitoryBedDetails/ThredStep',
              name: 'ThredStep',
              component: ThredStep
            }
          ]
        },
        {
          path: '/mainPage/manageClass/:id',
          name: 'manageClass',
          component: manageClass
        },
        {
          path: '/mainPage/dormitory/:id',
          name: 'dormitory',
          component: dormitory
        }, {
          path: '/mainPage/equipmentManagement/:id',
          name: 'EquipmentManagement',
          component: EquipmentManagement
        },
        {
          path: '/mainPage/Account',
          name: 'Account',
          component: Account
        }
      ]
    },
    {
      path: '*',
      redirect: '/mainPage/institute'
    }
  ]
})
