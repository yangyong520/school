import axios from '../axios' // 网络请求

const api = {
  // 宿管
  statApplyFormByAdminExt: '/home/statApplyFormByAdminExt', // 待处理申请
  getBuildNameByAdminExt: '/home/getBuildNameByAdminExt', // 楼栋概况
  statThisProfileInfo: '/home/statThisProfileInfo', // 今日概况
  statRealBedTimeInfoBySg: '/home/statRealBedTimeInfoBySg', // 实时归寝
  getOutBedStudentInfoBySgList: '/home/getOutBedStudentInfoBySgList', // 离寝名单
  getAreaBuildingFormList: '/area/getAreaBuildingFormList', // 获取区域楼栋
  // 辅导员
  statAuditingInfoByTeacher: '/home/statAuditingInfoByTeacher', // 院系管理员的审核信息
  statProfileInfoByTeacher: '/home/statProfileInfoByTeacher', // 昨日状况
  statRealBedTimeInfoByTeacher: '/home/statRealBedTimeInfoByTeacher', // 实时归寝
  statClassInfoListByTeacher: '/home/statClassInfoListByTeacher', // 班级状况信息
  getOutBedStudentInfoByTeacherList: '/home/getOutBedStudentInfoByTeacherList', // 班级状况信息
  statAttendanceInfo: '/home/statAttendanceInfo', // 考勤的统计
  getGradeClassList: '/classes/getGradeClassList', // 获取班级和年级
  // 系统管理员
  statSchoolInfoBySys: '/home/statSchoolInfoBySys', // 系统管理员中的学校概况
  statLateNoRecordInfo: '/home/statLateNoRecordInfo', // 报警数
  statAbnormalList: '/home/statAbnormalList', // 异常行为统计
  statBreakRuleList: '/home/statBreakRuleList', // 违纪处理
  statApplyInfoList: '/home/statApplyInfoList', // 申请数
  statApplyInfoListTwo: '/home/statGuaranteeInfo', // 申请数
  // 院系管理员
  statBreakRuleListByYxAdmin: '/home/statBreakRuleListByYxAdmin', // 违纪处理
  statApplyInfoListByYxAdmin: '/home/statApplyInfoListByYxAdmin', // 违纪处理
  statAbnormalListByYxAdmin: '/home/statAbnormalListByYxAdmin', // 违纪处理
  statLateNoRecordInfoByYxAdmin: '/home/statLateNoRecordInfoByYxAdmin', // 报警数
  statHouseInfo: '/home/statHouseInfo', // 区域概况
  statSchoolInfoByYxSys: 'home/statSchoolInfoByYxSys',
  // 考情分析的异常名单
  unusualList: 'home/getStudentAbAttendInfoList',
  // 实时出入人数
  realTimePerCount: '/api/realTimeStat'
}

// 系统管理员
export const statSchoolInfoBySys = function (params) {
  return axios({
    params,
    url: api.statSchoolInfoBySys,
    method: 'get'
  })
}
export const realTimePerCount = function (params) {
  return axios({
    params,
    url: api.realTimePerCount,
    method: 'get'
  })
}
export const unusualList = function (params) {
  return axios({
    params,
    url: api.unusualList,
    method: 'get'
  })
}
export const statSchoolInfoByYxSys = function (params) {
  return axios({
    params,
    url: api.statSchoolInfoByYxSys,
    method: 'get'
  })
}
export const getOutBedStudentInfoBySgList = function (params) {
  return axios({
    params,
    url: api.getOutBedStudentInfoBySgList,
    method: 'get'
  })
}
export const statRealBedTimeInfoBySg = function (params) {
  return axios({
    params,
    url: api.statRealBedTimeInfoBySg,
    method: 'get'
  })
}
export const statHouseInfo = function (params) {
  return axios({
    params,
    url: api.statHouseInfo,
    method: 'get'
  })
}
export const statAbnormalList = function (params) {
  return axios({
    params,
    url: api.statAbnormalList,
    method: 'get'
  })
}
export const statBreakRuleList = function (params) {
  return axios({
    params,
    url: api.statBreakRuleList,
    method: 'get'
  })
}
export const statApplyInfoList = function (params) {
  return axios({
    params,
    url: api.statApplyInfoList,
    method: 'get'
  })
}
export const statApplyInfoListTwo = function (params) {
  return axios({
    params,
    url: api.statApplyInfoListTwo,
    method: 'get'
  })
}
export const statLateNoRecordInfo = function (params) {
  return axios({
    params,
    url: api.statLateNoRecordInfo,
    method: 'get'
  })
}
// 院系管理员
export const statBreakRuleListByYxAdmin = function (params) {
  return axios({
    params,
    url: api.statBreakRuleListByYxAdmin,
    method: 'get'
  })
}
export const statApplyInfoListByYxAdmin = function (params) {
  return axios({
    params,
    url: api.statApplyInfoListByYxAdmin,
    method: 'get'
  })
}
export const statAbnormalListByYxAdmin = function (params) {
  return axios({
    params,
    url: api.statAbnormalListByYxAdmin,
    method: 'get'
  })
}
export const statLateNoRecordInfoByYxAdmin = function (params) {
  return axios({
    params,
    url: api.statLateNoRecordInfoByYxAdmin,
    method: 'get'
  })
}
// 宿管
export const getAreaBuildingFormList = function (params) {
  return axios({
    params,
    url: api.getAreaBuildingFormList,
    method: 'get'
  })
}
export const statApplyFormByAdminExt = function (params) {
  return axios({
    params,
    url: api.statApplyFormByAdminExt,
    method: 'get'
  })
}
export const statThisProfileInfo = function (params) {
  return axios({
    params,
    url: api.statThisProfileInfo,
    method: 'get'
  })
}
export const getBuildNameByAdminExt = function (params) {
  return axios({
    params,
    url: api.getBuildNameByAdminExt,
    method: 'get'
  })
}
// 辅导员
export const statAuditingInfoByTeacher = function (params) {
  return axios({
    params,
    url: api.statAuditingInfoByTeacher,
    method: 'get'
  })
}
export const statProfileInfoByTeacher = function (params) {
  return axios({
    params,
    url: api.statProfileInfoByTeacher,
    method: 'get'
  })
}
export const statClassInfoListByTeacher = function (params) {
  return axios({
    params,
    url: api.statClassInfoListByTeacher,
    method: 'get'
  })
}
export const getGradeClassList = function (params) {
  return axios({
    params,
    url: api.getGradeClassList,
    method: 'get'
  })
}
export const statAttendanceInfo = function (params) {
  return axios({
    params,
    url: api.statAttendanceInfo,
    method: 'get'
  })
}
export const getOutBedStudentInfoByTeacherList = function (params) {
  return axios({
    params,
    url: api.getOutBedStudentInfoByTeacherList,
    method: 'get'
  })
}
export const statRealBedTimeInfoByTeacher = function (params) {
  return axios({
    params,
    url: api.statRealBedTimeInfoByTeacher,
    method: 'get'
  })
}
