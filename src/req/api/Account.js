import axios from '../axios' // 网络请求

const api = {
  // 角色管理
  insertSysUser: '/sysUser/insertSysUser', // 新增账号
  getSysUserList: '/sysUser/getSysUserList', // 獲取列表
  editSysUser: '/sysUser/editSysUser', // 修改账号信息
  delSysUser: '/sysUser/delSysUser', // 删除账号信息
  getSysUser: '/sysUser/getSysUser', // 账号详情
  deleteUserList: '/sysUser/deleteUserList', // 批量删除
  countNumReal: '/realCheck/statRealCheckInfo',
  getCameraList: '/camera/getCameraList'
}

// 角色管理
export const insertSysUser = function (data) {
  return axios({
    data,
    url: api.insertSysUser,
    method: 'post'
  })
}
export const editSysUser = function (data) {
  return axios({
    data,
    url: api.editSysUser,
    method: 'post'
  })
}
export const deleteUserList = function (data) {
  return axios({
    data,
    url: api.deleteUserList,
    method: 'post'
  })
}
export const delSysUser = function (params) {
  return axios({
    params,
    url: api.delSysUser,
    method: 'get'
  })
}
export const getCameraList = function (params) {
  return axios({
    params,
    url: api.getCameraList,
    method: 'get'
  })
}
export const countNumReal = function (params) {
  return axios({
    params,
    url: api.countNumReal,
    method: 'get'
  })
}
export const getSysUserList = function (params) {
  return axios({
    params,
    url: api.getSysUserList,
    method: 'get'
  })
}
export const getSysUser = function (params) {
  return axios({
    params,
    url: api.getSysUser,
    method: 'get'
  })
}
