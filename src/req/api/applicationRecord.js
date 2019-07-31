import axios from '../axios' // 网络请求

const api = {
  // 记录查询
  // 申请记录
  // 设置查询
  getApplySetInfo: '/applySet/getApplySetInfo', // 查询设置

  // 设置
  inertApplySetInfo: '/applySet/inertApplySetInfo', // 设置

  // 调寝申请
  queryChangeRoomList: '/applyRecord/queryChangeRoomList', // 获取调寝申请记录
  handleChangeRoom: '/applyRecord/handleChangeRoom', // 立即处理调寝申请

  // 保修申请
  queryRepairsRecordList: '/applyRecord/queryRepairsRecordList', // 获取保修申请记录
  handleRepairsRecord: '/applyRecord/handleRepairsRecord', // 立即处理保修申请

  // 被访申请
  queryVisiAccessRecordList: '/applyRecord/queryVisiAccessRecordList', // 获取被访申请记录
  handleVisiAccessRecord: '/applyRecord/handleVisiAccessRecord', // 立即处理被访申请

  // 请假申请
  queryBegOffRecordList: '/applyRecord/queryBegOffRecordList', // 获取请假申请记录
  handleBegOffRecord: '/applyRecord/handleBegOffRecord' // 立即处理请假申请
}

// 设置查询
export const getApplySetInfo = function (params) {
  return axios({
    params,
    url: api.getApplySetInfo,
    method: 'get'
  })
}
// 设置
export const inertApplySetInfo = function (data) {
  return axios({
    data,
    url: api.inertApplySetInfo,
    method: 'post'
  })
}

// 记录查询
// 申请记录
// 获取调寝申请记录
export const queryChangeRoomList = function (params) {
  return axios({
    params,
    url: api.queryChangeRoomList,
    method: 'get'
  })
}
// 立即处理调寝申请
export const handleChangeRoom = function (data) {
  return axios({
    data,
    url: api.handleChangeRoom,
    method: 'post'
  })
}
// 保修申请
// 获取保修申请记录
export const queryRepairsRecordList = function (params) {
  return axios({
    params,
    url: api.queryRepairsRecordList,
    method: 'get'
  })
}
// 立即处理保修申请
export const handleRepairsRecord = function (data) {
  return axios({
    data,
    url: api.handleRepairsRecord,
    method: 'post'
  })
}
// 被访申请
// 获取被访申请记录
export const queryVisiAccessRecordList = function (params) {
  return axios({
    params,
    url: api.queryVisiAccessRecordList,
    method: 'get'
  })
}
// 立即处理被访申请
export const handleVisiAccessRecord = function (data) {
  return axios({
    data,
    url: api.handleVisiAccessRecord,
    method: 'post'
  })
}
// 请假申请
// 获取请假申请记录
export const queryBegOffRecordList = function (params) {
  return axios({
    params,
    url: api.queryBegOffRecordList,
    method: 'get'
  })
}
// 立即处理请假申请
export const handleBegOffRecord = function (data) {
  return axios({
    data,
    url: api.handleBegOffRecord,
    method: 'post'
  })
}
