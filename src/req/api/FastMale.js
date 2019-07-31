import axios from '../axios' // 网络请求

const api = {
  // 快递
  deleteButchDelivery: '/delivery/deleteButchDelivery', // 批量删除快递站点信息
  deleteDeliveryByPrimaryKey: '/delivery/deleteDeliveryByPrimaryKey', // 主键删除快递站点信息
  queryDeliveryList: '/delivery/queryDeliveryList', // 查询快递站点信息列表 分页
  insertDelivery: '/delivery/insertDelivery', // 添加快递站点信息
  updateDeliveryByPrimaryKey: '/delivery/updateDeliveryByPrimaryKey' // 修改快递站点信息
}

// 快递
export const deleteButchDelivery = function (data) {
  return axios({
    data,
    url: api.deleteButchDelivery,
    method: 'post'
  })
}
export const deleteDeliveryByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteDeliveryByPrimaryKey,
    method: 'post'
  })
}
export const queryDeliveryList = function (params) {
  return axios({
    params,
    url: api.queryDeliveryList,
    method: 'get'
  })
}
export const insertDelivery = function (data) {
  return axios({
    data,
    url: api.insertDelivery,
    method: 'post'
  })
}
export const updateDeliveryByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateDeliveryByPrimaryKey,
    method: 'post'
  })
}
