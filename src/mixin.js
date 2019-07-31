import { mapMutations, mapState } from 'vuex'
import Vue from 'vue'
import req from '@/req/req'
const { getRoleModuleListConter } = req

// 权限控制-查看
const roleControlMixin = {
  data () {
    return {
      spliceArrMust: []
    }
  },
  computed: {
    ...mapState(['originLeftSideArr'])
  },
  methods: {
    ...mapMutations(['setSpinningRole']),
    spliceLeftSide (arr, newArr) {
      // 切去侧边栏
      const { setLeftSideArrRole, spliceLeftSide } = this
      for (let obj of arr) {
        if (!obj.childrenList || obj.childrenList.length === 0) {
          if (obj.isView === 1) {
            newArr.push(obj)
          } else if (obj.isView === 0) {
            setLeftSideArrRole(obj.moduleName)
          }
        } else {
          spliceLeftSide(obj.childrenList, newArr)
        }
      }
    },
    getRoleList () {
      const { spliceLeftSide, setHavRoleList, deepCopy, setLeftSideArr, setRoleListZero, setLeftSideArrRole } = this
      const setArr = deepCopy(this.originLeftSideArr)
      setLeftSideArr(setArr)
      this.setSpinningRole(true)
      getRoleModuleListConter().then(({ data: { code, data = [] } }) => {
        this.setSpinningRole(false)
        if (code === 0) {
          data.forEach((ele, index) => {
            if (!ele.childrenList || ele.childrenList === 0) {
            } else {
              ele.childrenList.forEach((el, inde) => {
                if (el.childrenList.length !== 0 || !el.childrenList) {
                  if (el.childrenList.every(e => e.isView === 0)) {
                    this.spliceArrMust.push(el)
                  }
                }
              })
            }
          })
          this.spliceArrMust.forEach(ele => {
            setLeftSideArrRole(ele.moduleName + '-must')
          })
          setRoleListZero(data)
          const newArr = []
          spliceLeftSide(data, newArr)
          setHavRoleList(newArr)
          if (!newArr.some( ele => ele.moduleName === '首页')) {
            // console.log('进入')
            for (let key in this.routerPath) {
              if (this.routerPath[key].name === '首页') {
                this.$router.push(this.leftSideArr[0].children[0].keyName)
              }
            }
          }
        }
      }, () => {
        this.setSpinningRole(false)
      })
    },
    getType (obj) {
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        return 'Object'
      } else if (Object.prototype.toString.call(obj) === '[object Array]') {
        return 'Array'
      } else {
        return 'nomal'
      }
    },
    deepCopy (obj) {
      const { getType, deepCopy } = this
      if (getType(obj) === 'nomal') {
        return obj
      } else {
        var newObj = getType(obj) === 'Object' ? {} : []
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key])
          }
        }
      }
      return newObj
    },
    ...mapMutations(['setHavRoleList', 'setLeftSideArrRole', 'setLeftSideArr', 'setRoleListZero'])
  }
}

// 页面逐个按钮权限控制-操作
const roleControlBtnMixin = {
  data () {
    return {
      roleAllTrue: {
        isDeal: 1, // 处理
        isDel: 1, // 删除
        isImp: 1, // 导入
        isTiaoq: 1, // 调寝
        isTuiq: 1, // 退寝
        isChangwfp: 1, // 床位分配
        isUpload: 1, // 上传
        isPush: 1, // 推送
        isBinding: 1, // 绑定
        isExp: 1, // 导出
        isRepeat: 1, // 重发
        isPermission: 1, // 权限设置
        isView: 1, // 查看
        isSet: 1, // 设置
        isAdd: 1, // 添加
        isAuditing: 1, // 审核
        isEdit: 1 // 编辑
      }
    }
  },
  computed: {
    ...mapState(['havRoleList']),
    roleDataObj () {
      const { havRoleList, roleName, roleAllTrue } = this
      const data = Vue.ls.get('USER_DATA')
      if (data.type === 0) {
        console.log('如果是超级管理员就不进行权限控制')
        return roleAllTrue
      } else {
        for (let item of havRoleList) {
          if (item.moduleName === roleName) {
            console.log('进入了按钮，权限控制', item, item.moduleName)
            return item
          }
        }
        return roleAllTrue
      }
    }
  },
  methods: {
  }
}

export { roleControlMixin, roleControlBtnMixin }
