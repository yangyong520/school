import axios from '../axios' // 网络请求

const api = {
  // 公式
  getDetail: '/board/queryBoardByPrimaryKey',
  insertBoard: '/board/insertBoard', // 添加公告信息
  queryBoardList: '/board/queryBoardList', // 获取公告信息
  deleteButchBoard: '/board/deleteButchBoard', // 批量删除公告信息
  deleteBoardByPrimaryKey: '/board/deleteBoardByPrimaryKey', // 主键删除公告信息
  updateBoardByPrimaryKey: '/board/updateBoardByPrimaryKey', // 修改
  facilityList: '/callAlarm/selectAllCamera',
  strangerList: '/callAlarm/queryStanger',
  // 非法通行
  ErrorList: '/callAlarm/queryIllegallList'
}

export const strangerList = function (params) {
  return axios({
    params,
    url: api.strangerList,
    method: 'get'
  })
}
export const ErrorList = function (params) {
  return axios({
    params,
    url: api.ErrorList,
    method: 'get'
  })
}
export const insertBoard = function (data) {
  return axios({
    data,
    url: api.insertBoard,
    method: 'post'
  })
}
export const getDetail = function (params) {
  return axios({
    params,
    url: api.getDetail,
    method: 'get'
  })
}
export const facilityList = function (params) {
  return axios({
    params,
    url: api.facilityList,
    method: 'get'
  })
}
export const updateBoardByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateBoardByPrimaryKey,
    method: 'post'
  })
}
export const deleteBoardByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteBoardByPrimaryKey,
    method: 'post'
  })
}
export const deleteButchBoard = function (data) {
  return axios({
    data,
    url: api.deleteButchBoard,
    method: 'post'
  })
}
export const queryBoardList = function (params) {
  return axios({
    params,
    url: api.queryBoardList,
    method: 'get'
  })
}
