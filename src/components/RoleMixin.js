const RoleMixin = {
  methods: {
    // 工具 函数
    getFlag (obj) {
      // 返回该对象所有状态的Boolean值
      let flagArr = []
      for (let key in obj) {
        if (key.indexOf('Str') !== -1) {
          flagArr.push(Boolean(obj[key.replace('Str', '')]))
        }
      }
      return flagArr
    },
    setFlag (obj, flag) {
      const { userData } = this
      for (let key in obj) {
        if (key.indexOf('Str') !== -1) {
          if (userData.type === 0 || obj[key.replace('Str', 'Opera')]) {
            obj[key.replace('Str', '')] = flag
          }
        }
      }
    },
    setGroupModule (arr, flag) {
      const { setGroupModule, setFlag } = this
      arr.forEach(ele => {
        if (!ele.childrenList || ele.childrenList.length === 0) {
          setFlag(ele, flag)
        } else {
          setGroupModule(ele.childrenList, flag)
        }
      })
    },
    // 点击处理函数
    onChange (obj, str) {
      // 切换对象，每项具体功能
      if (!str) {
        return
      }
      /*
      {
        isDeal: 处理
        isDel:  删除
        isImp: 导入
        isTiaoq: 调寝
        isTuiq: 退寝
        isChangwfp: 床位分配
        isUpload: 上传
        isPush: 推送
        isBinding: 绑定
        isExp: 导出
        isRepeat: 重发
        isPermission: 权限设置
        isView: 查看
        isSet: 设置
        isAdd: 增加
        isAuditing: 审核
        isEdit: 编辑
      }
      */
      let values = []
      Object.values(obj).map(x => {
        if ((typeof x !== 'string') && Number(x) === parseFloat(x)) {
          values.push(x)
        }
      })
      // 选择其他自动选中查看
      let arr = []
      Object.keys(obj).map(x => {
        if (x.indexOf('is') > -1 && x !== 'isView' && x.indexOf('Str') === -1 && x !== 'childrenList') {
          arr.push(x)
        }
      })
      if (arr.includes(str)) {
        if (obj[str] === 0) {
          obj['isView'] = 1
        }
      }
      if (obj['isView'] === 1 && str === 'isView') {
        console.log(1)
        obj['isDeal'] = 0
        obj['isDel'] = 0
        obj['isImp'] = 0
        obj['isTiaoq'] = 0
        obj['isTuiq'] = 0
        obj['isChangwfp'] = 0
        obj['isUpload'] = 0
        obj['isPush'] = 0
        obj['isBinding'] = 0
        obj['isExp'] = 0
        obj['isRepeat'] = 0
        obj['isPermission'] = 0
        obj['isSet'] = 0
        obj['isAdd'] = 0
        obj['isAuditing'] = 0
        obj['isEdit'] = 0
      }
      // 选中新增和编辑
      if (str === 'isEdit') {
        obj['isAdd'] = obj['isAdd'] === 0 ? 1 : 0
      }
      if (str === 'isAdd') {
        obj['isEdit'] = obj['isEdit'] === 0 ? 1 : 0
      }
      obj[str] = obj[str] === 0 ? 1 : 0
    },
    onChangeGroup (obj) {
      // 切换对象
      const { getFlag, setFlag } = this
      let flagArr = getFlag(obj)
      if (flagArr.every(ele => ele)) {
        setFlag(obj, 0)
      } else {
        setFlag(obj, 1)
      }
    },
    onChangeGroupModule (arr) {
      // 判断怎么，切换模块
      const { getModuleChecked, setGroupModule } = this
      if (getModuleChecked(arr)) {
        // to 0
        setGroupModule(arr, 0)
      } else {
        // to 1
        setGroupModule(arr, 1)
      }
    },
    // 对象 状态
    getIndeterminate (obj) {
      // 判断对象，是否为半选中状态
      const { getFlag } = this
      let flagArr = getFlag(obj)
      return flagArr.some(ele => ele)
    },
    getChecked (obj) {
      // 判断对象，为半选中状态
      const { getFlag } = this
      let flagArr = getFlag(obj)
      return flagArr.every(ele => ele)
    },
    // 模块 状态
    getModuleChecked (arr) {
      // 递归解析模块状态
      const { getChecked, getModuleChecked } = this
      return arr.every(ele => {
        if (!ele.childrenList || ele.childrenList.length === 0) {
          return getChecked(ele)
        } else {
          return getModuleChecked(ele.childrenList)
        }
      })
    },
    // 模块半选中
    getModuleIndeterminate (arr) {
      const { getFlag, getModuleIndeterminate } = this
      return arr.some(ele => {
        if (!ele.childrenList || ele.childrenList.length === 0) {
          let flagArr = getFlag(ele)
          return flagArr.some(ele => ele)
        } else {
          return getModuleIndeterminate(ele.childrenList)
        }
      })
    },
    // 是否可以修改
    checkedStatus (itemObj, inde) {
      const { userData } = this
      return !(
        userData.type === 0 || itemObj[inde.replace('Str', 'Opera')] !== 0
      )
    }
  }
}

export { RoleMixin }
