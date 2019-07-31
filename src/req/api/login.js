import axios from '../axios' // 网络请求

const api = {
  // 登录
  login: '/login', // 添加区域信息
  getRoleModuleListConter: '/getRoleModuleList', // 权限控制
  updatePassword: '/user/updatePassword', // 修改密码
  getCountNum: '/notification/getNoReadNumber'
}

// 登录
export const login = function (data) {
  return axios({
    data,
    url: api.login,
    method: 'post'
  })
}
export const getCountNum = function (params) {
  return axios({
    params,
    url: api.getCountNum,
    method: 'get'
  })
}
export const updatePassword = function (data) {
  return axios({
    data,
    url: api.updatePassword,
    method: 'post'
  })
}
export const getRoleModuleListConter = function (params) {
  return axios({
    params,
    url: api.getRoleModuleListConter,
    method: 'get'
  })
}
