import axios from '../axios' // 网络请求

const api = {
  // 导出区域
  searchExportArea: '/export/queryExportArea',
  // 导出黑名单
  searchExportBlack: '/export/queryExportBlackUser',
  // 导出其他人
  searchExoportOther: '/export/queryExportOtherPeople',
  // 导出宿管信息
  searchExportSg: '/export/queryExportSGAdmin',
  // 导出学生信息
  searchExportStu: '/export/queryExportStudent',
  // 导出辅导员
  searchExportTeacher: '/export/queryExportTeacher',
  // 实时归寝
  searchExportQs: '/returnDorm/queryExportRealTimeReturnDoemList',
  // 访客超市
  queryExportVisitorRecordList: '/callAlarm/queryExportVisitorRecordList',
  // 考勤导出
  queryKqExprt: '/attandence/queryExportAttandenceRecordList',
  // 违纪记录
  queryExportBreakRule: '/export/queryExportBreakRule',
  // 楼栋
  queryExportBuildIng: '/export/queryExportBuildIng',
  // 专业
  queryExportProInfo: '/export/queryExportProInfo',
  // 班级
  queryExportClassInfo: '/export/queryExportClassInfo',
  // 导出考勤分析
  exportLogs: ''
}

export const queryKqExprt = function (data) {
  return axios({
    data,
    url: api.queryKqExprt,
    method: 'post'
  })
}
export const queryExportClassInfo = function (data) {
  return axios({
    data,
    url: api.queryExportClassInfo,
    method: 'post'
  })
}
export const queryExportProInfo = function (data) {
  return axios({
    data,
    url: api.queryExportProInfo,
    method: 'post'
  })
}
export const queryExportBuildIng = function (data) {
  return axios({
    data,
    url: api.queryExportBuildIng,
    method: 'post'
  })
}
export const queryExportBreakRule = function (data) {
  return axios({
    data,
    url: api.queryExportBreakRule,
    method: 'post'
  })
}
export const searchExportArea = function (data) {
  return axios({
    data,
    url: api.searchExportArea,
    method: 'post'
  })
}
export const queryExportVisitorRecordList = function (data) {
  return axios({
    data,
    url: api.queryExportVisitorRecordList,
    method: 'post'
  })
}
export const searchExportBlack = function (data) {
  return axios({
    data,
    url: api.searchExportBlack,
    method: 'post'
  })
}
export const searchExoportOther = function (data) {
  return axios({
    data,
    url: api.searchExoportOther,
    method: 'post'
  })
}
export const searchExportSg = function (data) {
  return axios({
    data,
    url: api.searchExportSg,
    method: 'post'
  })
}
export const searchExportStu = function (data) {
  return axios({
    data,
    url: api.searchExportStu,
    method: 'post'
  })
}
export const searchExportTeacher = function (data) {
  return axios({
    data,
    url: api.searchExportTeacher,
    method: 'post'
  })
}

export const searchExportQs = function (data) {
  return axios({
    data,
    url: api.searchExportQs,
    method: 'post'
  })
}
