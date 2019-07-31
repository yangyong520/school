import Vuex from 'vuex'
import Vue from 'vue'
import limt from './modules/limt'
import user from './modules/user'
import Bad from './modules/Bad'
import { baseUrl } from '@/baseUrl'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    baseUrl,
    data: '我是vuex中的data',
    spinningRole: false,
    sendTapData: {},
    havRoleList: [], // 可以查看的权限的对象数组
    roleListZero: [],
    leftSideArr: [
      {
        name: '首页',
        keyName: 'Institute',
        icon: 'iconshouye'
      },
      {
        name: '人脸检索',
        keyName: 'face',
        icon: 'iconxiaoxi'
      },
      {
        name: '归寝管理',
        keyName: 'sub1',
        icon: 'iconyoupinjiaju_danxian_chuang',
        children: [
          {
            name: '实时查寝',
            keyName: 'ActualTimeCheckSleep'
          },
          {
            name: '归寝记录',
            keyName: 'GuiaiCheckSleep'
          },
          {
            name: '归寝规则',
            keyName: 'RuleCheckSleep'
          }
        ]
      },
      {
        name: '记录查询',
        keyName: 'sub2',
        icon: 'iconchaxun',
        children: [
          {
            name: '出入记录',
            keyName: 'ComeGoNotes'
          },
          {
            name: '访客记录',
            keyName: 'VistorNotes'
          },
          {
            name: '报警管理',
            keyName: 'PliceNotes'
          },
          {
            name: '申请记录',
            keyName: 'ApplicationNotes'
          },
          {
            name: '违纪记录',
            keyName: 'BreakRuleNotes'
          },
          {
            name: '陌生人记录',
            keyName: 'stranger'
          }
        ]
      },
      {
        name: '数据中心',
        keyName: 'sub3',
        icon: 'iconshuju',
        children: [
          {
            name: '宿舍管理',
            keyName: 'dormitory'
          },
          {
            name: '班级管理',
            keyName: 'manageClass'
          },
          {
            name: '人员管理',
            keyName: 'personnel'
          },
          {
            name: '公告管理',
            keyName: 'Notice'
          },
          {
            name: '设备管理',
            keyName: 'EquipmentManagement'
          },
          {
            name: '快递站点',
            keyName: 'FastMale'
          }
        ]
      },
      {
        name: '系统设置',
        keyName: 'sub4',
        icon: 'iconshezhi1',
        children: [
          {
            name: '角色管理',
            keyName: 'Role'
          },
          {
            name: '账号管理',
            keyName: 'Account'
          }
        ]
      }
    ],
    originLeftSideArr: [
      {
        name: '首页',
        keyName: 'Institute',
        icon: 'iconshouye'
      },
      {
        name: '人脸检索',
        keyName: 'face',
        icon: 'iconxiaoxi'
      },
      {
        name: '归寝管理',
        keyName: 'sub1',
        icon: 'iconyoupinjiaju_danxian_chuang',
        children: [
          {
            name: '实时查寝',
            keyName: 'ActualTimeCheckSleep'
          },
          {
            name: '归寝记录',
            keyName: 'GuiaiCheckSleep'
          },
          {
            name: '归寝规则',
            keyName: 'RuleCheckSleep'
          }
        ]
      },
      {
        name: '记录查询',
        keyName: 'sub2',
        icon: 'iconchaxun',
        children: [
          {
            name: '出入记录',
            keyName: 'ComeGoNotes'
          },
          {
            name: '访客记录',
            keyName: 'VistorNotes'
          },
          {
            name: '报警管理',
            keyName: 'PliceNotes'
          },
          {
            name: '申请记录',
            keyName: 'ApplicationNotes'
          },
          {
            name: '违纪记录',
            keyName: 'BreakRuleNotes'
          },
          {
            name: '陌生人记录',
            keyName: 'stranger'
          }
        ]
      },
      {
        name: '数据中心',
        keyName: 'sub3',
        icon: 'iconshuju',
        children: [
          {
            name: '宿舍管理',
            keyName: 'dormitory'
          },
          {
            name: '班级管理',
            keyName: 'manageClass'
          },
          {
            name: '人员管理',
            keyName: 'personnel'
          },
          {
            name: '公告管理',
            keyName: 'Notice'
          },
          {
            name: '设备管理',
            keyName: 'EquipmentManagement'
          },
          {
            name: '快递站点',
            keyName: 'FastMale'
          }
        ]
      },
      {
        name: '系统设置',
        keyName: 'sub4',
        icon: 'iconshezhi1',
        children: [
          {
            name: '角色管理',
            keyName: 'Role'
          },
          {
            name: '账号管理',
            keyName: 'Account'
          }
        ]
      }
    ]
  },
  mutations: {
    setSpinningRole (state, update) {
      state.spinningRole = update
    },
    setRoleListZero (state, update) {
      // let spliceArr = []
      // for (let item of update) {
      //   if (item.childrenList === 0 || !item.childrenList) {
      //     if (item.isView === 0) {
      //       spliceArr.push(item)
      //     }
      //   } else {
      //     for (let ite of item.childrenList) {
      //       if (ite.childrenList === 0 || !ite.childrenList) {
      //         if (ite.isView === 0) {
      //           spliceArr.push(ite)
      //         }
      //       }
      //     }
      //   }
      // }
      state.roleListZero = update
    },
    setTapData (state, update) { // 登录token
      state.sendTapData = update
    },
    setLeftSideArr (state, update) { //  重置侧边栏
      state.leftSideArr = update
    },
    setLeftSideArrIndex (state, update) { // 设置首页
      let arr = [...state.leftSideArr]
      let obj = arr.splice(0, 1)[0]
      obj.keyName = update
      arr.splice(0, 0, obj)
      state.leftSideArr = arr
    },
    setLeftSideArrRole (state, strSpliceName) {
      let arrStr = strSpliceName.split('-')
      if (arrStr[1]) {
        strSpliceName = arrStr[0]
      }

      let arr = [...state.leftSideArr]
      let funSplice = arr => arr.filter(ele => {
        if (!ele.children) {
          if (!arrStr[1]) {
            if (strSpliceName === '出入记录' || strSpliceName === '班级管理') {
              return true
            }
          }
          return ele.name !== strSpliceName
        } else {
          ele.children = funSplice(ele.children)
          return ele.children.length !== 0
        }
      })
      let newArr = funSplice(arr)
      state.leftSideArr = newArr
      store.dispatch('setLeftSide', Vue.ls.get('USER_DATA').type)
    },
    setHavRoleList (state, update) {
      state.havRoleList = update
    }
  },
  actions: {
    setLeftSide ({ commit }, type) {
      // 0：超级管理，1：学生，2辅导员，3：系统管理员，4;宿管，5：院系管理，6：家长，7：其他
      if (type === 5 || type === 3 || type === 0) {
        commit('setLeftSideArrIndex', 'Institute')
      } else if (type === 4) {
        commit('setLeftSideArrIndex', 'HouseMaster')
      } else if (type === 2) {
        commit('setLeftSideArrIndex', 'Assistant')
      }
    }
  },
  modules: {
    limt,
    user,
    Bad
  }
})
