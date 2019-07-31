import axios from '../axios' // 网络请求

const api = {
  // 记录查询
  // 访客记录
  queryVisitorInOutList: '/inout/queryVisitorInOutList', // 获取访客记录
  queryVisitorList: '/inout/queryVisitorList ', // 导出访客记录

  // 出入记录
  queryInOutList: '/inout/queryInOutList', // 获取出入记录
  queryList: '/inout/queryList', // 导出出入记录

  // 考勤设置
  settingAttandence: '/inout/settingAttandence', // 考勤设置
  // 同步日志
  sycLogs: '/terminal/queryLog',
  // 重新发送
  reSend: '/terminal/reSend'
}
// 获取访客记录
export const queryVisitorInOutList = function (params) {
  return axios({
    params,
    url: api.queryVisitorInOutList,
    method: 'get'
  })
}
// 导出访客记录
export const queryVisitorList = function (data) {
  return axios({
    data,
    url: api.queryVisitorList,
    method: 'post'
  })
}

// 获取出入记录
export const queryInOutList = function (params) {
  return axios({
    params,
    url: api.queryInOutList,
    method: 'get'
  })
}
// 导出出入记录
export const queryList = function (data) {
  return axios({
    data,
    url: api.queryList,
    method: 'post'
  })
}
export const sycLogs = function (params) {
  return axios({
    params,
    url: api.sycLogs,
    method: 'get'
  })
}
export const reSend = function (params) {
  return axios({
    params,
    url: api.reSend,
    method: 'get'
  })
}
// 考勤设置
export const settingAttandence = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.settingAttandence,
    method: 'post'
  })
}
