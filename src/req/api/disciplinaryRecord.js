import axios from '../axios' // 网络请求

const api = {
  // 记录查询
  // 违纪记录

  queryRecordList: '/breakRuleRecord/queryRecordList', // 获取违纪记录
  insert: '/breakRuleRecord/insert', // 添加违纪记录
  breakRuleRecord: '/breakRuleRecord/breakRuleRecord', // 立即处理违纪
  selectStudentByUserNum: '/user/selectStudentByUserNum', // 根据学号查询学生信息
}
// 记录查询
// 违纪记录
// 获取违纪记录
export const queryRecordList = function (params) {
  return axios({
    params,
    url: api.queryRecordList,
    method: 'get'
  })
}
// 添加违纪记录
export const insert = function (data) {
  return axios({
    data,
    url: api.insert,
    method: 'post'
  })
}
// 立即处理违纪
export const breakRuleRecord = function (data) {
  return axios({
    data,
    url: api.breakRuleRecord,
    method: 'post'
  })
}
// 根据学号查询学生信息
export const selectStudentByUserNum = function (params) {
  return axios({
    params,
    url: api.selectStudentByUserNum,
    method: 'get'
  })
}
