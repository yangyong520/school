import axios from '../axios' // 网络请求

const api = {
  // 归寝管理
  // 实时查寝
  queryRealTimeReturnDoemList: '/returnDorm/queryRealTimeReturnDoemList', // 获取实时查寝
  // 归寝记录列表
  queryReturnDormList: '/returnDorm/queryReturnDormList', // 获取归寝记录列表
  queryExportReturnDorm: '/returnDorm/queryExportReturnDorm', // 归寝记录导出
  // 归寝记录分析
  queryReturnDormAnalyse: '/returnDorm/queryReturnDormAnalyse', // 获取归寝记录列表

  // 归寝规则
  queryBuildList: '/area/queryBuildList', // 查询归寝列表

  // 设置归寝规则
  settingReturnDorm: '/returnDorm/settingReturnDorm', // 查询归寝列表
  // 筛选条件
  getCheckQueryInfoByUserId: '/realCheck/getCheckQueryInfoByUserId',
  // 实时归寝的查询
  realCheckList: '/realCheck/realCheckList',
  // 通过userId查询学生详情
  studentInfo: '/realCheck/getStudentInfoByUserId'
}

// 获取实时查寝
export const queryRealTimeReturnDoemList = function (params) {
  return axios({
    params,
    url: api.queryRealTimeReturnDoemList,
    method: 'get'
  })
}

// 获取归寝记录列表
export const queryReturnDormList = function (params) {
  return axios({
    params,
    url: api.queryReturnDormList,
    method: 'get'
  })
}
// 归寝记录导出
export const queryExportReturnDorm = function (data) {
  return axios({
    data,
    url: api.queryExportReturnDorm,
    method: 'post'
  })
}
// 归寝记录分析
export const queryReturnDormAnalyse = function (params) {
  return axios({
    params,
    url: api.queryReturnDormAnalyse,
    method: 'get'
  })
}

// 归寝规则
export const queryBuildList = function (params) {
  return axios({
    params,
    url: api.queryBuildList,
    method: 'get'
  })
}

// 设置归寝规则
export const settingReturnDorm = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.settingReturnDorm,
    method: 'post'
  })
}

export const getCheckQueryInfoByUserId = () => {
  return axios({
    url: api.getCheckQueryInfoByUserId,
    method: 'get'
  })
}

export const realCheckList = (params) => {
  return axios({
    params,
    url: api.realCheckList,
    method: 'get'
  })
}

export const studentInfo = (params) => {
  return axios({
    params,
    url: api.studentInfo,
    method: 'get'
  })
}
