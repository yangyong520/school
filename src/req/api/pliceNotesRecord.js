import axios from '../axios' // 网络请求

const api = {
  // 记录查询
  // 报警管理

  // 设置
  updateCallalarmSet: '/callAlarm/updateCallalarmSet', // 获取未归记录

  // 查看设置
  selectCallAlarmSet: '/callAlarm/selectCallAlarmSet', // 获取未归记录

  // 未归
  queryNoReturnList: '/callAlarm/queryNoReturnList', // 获取未归记录
  handleNoReturn: '/callAlarm/handleNoReturn', // 立即处理未归
  insertCallalarmSet: '/callAlarm/insertCallalarmSet', // 立即处理未归
  queryExportNoReturnList: '/callAlarm/queryExportNoReturnList', // 未归导出

  // 晚归
  queryLateReturnList: '/callAlarm/queryLateReturnList', // 获取晚归记录
  handleLateReturn: '/callAlarm/handleLateReturn', // 立即处理晚归
  queryExportLateReturnList: '/callAlarm/queryExportLateReturnList', // 晚归导出

  // 无记录
  queryNoRecordList: '/callAlarm/queryNoRecordList', // 获取无记录记录
  handleNoRecord: '/callAlarm/handleNoRecord', // 立即处理无记录
  queryExportNoRecordList: '/callAlarm/queryExportNoRecordList', // 无记录导出

  // 连进连出
  queryInOutRecordList: '/callAlarm/queryInOutRecordList', // 获取连进连出记录
  handleInOutRecord: '/callAlarm/handleInOutRecord', // 立即处理连进连出
  queryExportInOutRecord: '/callAlarm/queryExportInOutRecord', // 连进连出导出

  // 翻越
  queryThrowOverRecordList: '/callAlarm/queryThrowOverRecordList', // 获取翻越
  queryExportThrowOver: '/callAlarm/queryExportThrowOver', // 翻越导出

  // 尾随
  queryShadowList: '/callAlarm/queryShadowList', // 获取尾随
  queryExportShadowList: '/callAlarm/queryExportShadowList', // 尾随导出

  // 黑名单
  queryBlackInOutRecodeList: '/callAlarm/queryBlackInOutRecodeList', // 获取黑名单记录
  handleBlackInOut: '/callAlarm/handleBlackInOut', // 黑名单日志
  queryBlackInOutByUserId: '/callAlarm/queryBlackInOutByUserId', // 立即处理黑名单
  queryExportBlackRecordList: '/callAlarm/queryExportBlackRecordList', // 黑名单导出

  // 访客超时
  queryVisitTimeOutList: '/inout/queryVisitTimeOutList', // 获取访客超时

  // 设备异常
  queryFacilityExceptionList: '/machine/queryFacilityExceptionList' // 获取设备异常

}
// 设置
export const updateCallalarmSet = function (data) {
  return axios({
    data,
    url: api.updateCallalarmSet,
    method: 'post'
  })
}

// 查看设置
export const selectCallAlarmSet = function (params) {
  return axios({
    params,
    url: api.selectCallAlarmSet,
    method: 'get'
  })
}

// 记录查询
// 未归
// 获取未归记录
export const queryNoReturnList = function (params) {
  return axios({
    params,
    url: api.queryNoReturnList,
    method: 'get'
  })
}
export const insertCallalarmSet = function (data) {
  return axios({
    data,
    url: api.insertCallalarmSet,
    method: 'post'
  })
}
// 立即处理未归
export const handleNoReturn = function (data) {
  return axios({
    data,
    url: api.handleNoReturn,
    method: 'post'
  })
}
// 未归导出
export const queryExportNoReturnList = function (data) {
  return axios({
    data,
    url: api.queryExportNoReturnList,
    method: 'post'
  })
}
// 晚归
// 获取晚归记录
export const queryLateReturnList = function (params) {
  return axios({
    params,
    url: api.queryLateReturnList,
    method: 'get'
  })
}
// 立即处理晚归
export const handleLateReturn = function (data) {
  return axios({
    data,
    url: api.handleLateReturn,
    method: 'post'
  })
}
// 晚归导出
export const queryExportLateReturnList = function (data) {
  return axios({
    data,
    url: api.queryExportLateReturnList,
    method: 'post'
  })
}
// 无记录
// 获取无记录
export const queryNoRecordList = function (params) {
  return axios({
    params,
    url: api.queryNoRecordList,
    method: 'get'
  })
}
// 立即处理无记录
export const handleNoRecord = function (data) {
  return axios({
    data,
    url: api.handleNoRecord,
    method: 'post'
  })
}
// 无记录导出
export const queryExportNoRecordList = function (data) {
  return axios({
    data,
    url: api.queryExportNoRecordList,
    method: 'post'
  })
}
// 翻越
// 获取翻越
export const queryThrowOverRecordList = function (params) {
  return axios({
    params,
    url: api.queryThrowOverRecordList,
    method: 'get'
  })
}
// 翻越导出
export const queryExportThrowOver = function (data) {
  return axios({
    data,
    url: api.queryExportThrowOver,
    method: 'post'
  })
}
// 尾随
// 获取尾随
export const queryShadowList = function (params) {
  return axios({
    params,
    url: api.queryShadowList,
    method: 'get'
  })
}
// 尾随导出
export const queryExportShadowList = function (data) {
  return axios({
    data,
    url: api.queryExportShadowList,
    method: 'post'
  })
}

// 连进连出
// 获取连进连出
export const queryInOutRecordList = function (params) {
  return axios({
    params,
    url: api.queryInOutRecordList,
    method: 'get'
  })
}
// 立即处理连进连出
export const handleInOutRecord = function (data) {
  return axios({
    data,
    url: api.handleInOutRecord,
    method: 'post'
  })
}
// 连进连出导出
export const queryExportInOutRecord = function (data) {
  return axios({
    data,
    url: api.queryExportInOutRecord,
    method: 'post'
  })
}
// 黑名单
// 获取黑名单
export const queryBlackInOutRecodeList = function (params) {
  return axios({
    params,
    url: api.queryBlackInOutRecodeList,
    method: 'get'
  })
}
// 立即处理黑名单
export const handleBlackInOut = function (data) {
  return axios({
    data,
    url: api.handleBlackInOut,
    method: 'post'
  })
}
// 黑名单日志
export const queryBlackInOutByUserId = function (params) {
  return axios({
    params,
    url: api.queryBlackInOutByUserId,
    method: 'get'
  })
}
// 黑名单导出
export const queryExportBlackRecordList = function (data) {
  return axios({
    data,
    url: api.queryExportBlackRecordList,
    method: 'post'
  })
}
// 访客超时
// 获取访客超时
export const queryVisitTimeOutList = function (params) {
  return axios({
    params,
    url: api.queryVisitTimeOutList,
    method: 'get'
  })
}
// 设备异常
// 获取设备异常
export const queryFacilityExceptionList = function (params) {
  return axios({
    params,
    url: api.queryFacilityExceptionList,
    method: 'get'
  })
}
