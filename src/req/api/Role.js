import axios from '../axios' // 网络请求

const api = {
  // 角色
  getSystemRoleList: '/roleModule/getSystemRoleList', // 获取系统角色
  getRoleModuleList: '/roleModule/getRoleModuleList', // 获取权限配置
  editRoleModule: '/roleModule/editRoleModule', // 修改权限设置
  editDescribe: '/roleModule/editDescribe' // 修改描述信息
}

// 角色
export const getSystemRoleList = function (params) {
  return axios({
    params,
    url: api.getSystemRoleList,
    method: 'get'
  })
}
export const editDescribe = function (data) {
  return axios({
    data,
    url: api.editDescribe,
    method: 'post'
  })
}
export const getRoleModuleList = function (params) {
  return axios({
    params,
    url: api.getRoleModuleList,
    method: 'get'
  })
}
export const editRoleModule = function (data) {
  return axios({
    data,
    url: api.editRoleModule,
    method: 'post'
  })
}
