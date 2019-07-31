import axios from '../axios' // 网络请求

const api = {
  // 赤眸管理
  queryRedEyeList: '/machine/queryRedEyeList', // 获取赤眸列表
  updateRedEyeButch: '/machine/updateRedEyeButch', // 修改赤眸
  deleteRedEyeButch: '/machine/deleteRedEyeButch', // 删除
  // 闸机管理
  insertGateMachine: '/machine/insertGateMachine', // 添加闸机
  // 摄像投管理
  insertCamera: '/machine/insertCamera', // 添加设摄像头信息
  queryCameraList: '/machine/queryCameraList', // 查询摄像头信息列表 分页
  deleteCameraByPrimaryKey: '/machine/deleteCameraByPrimaryKey', // 主键删除摄像头信息
  deleteButchCamera: '/machine/deleteButchCamera', // 批量删除摄像头信息
  updateCameraByPrimaryKey: '/machine/updateCameraByPrimaryKey', // 修改摄像头信息
  // 大屏管理
  insertScreen: '/machine/insertScreen', // 添加大屏信息
  queryScreenList: '/machine/queryScreenList', // 添加大屏信息
  deleteScreenByPrimaryKey: '/machine/deleteScreenByPrimaryKey', // 主键删除大屏信息
  deleteButchScreen: '/machine/deleteButchScreen', // 批量删除大屏信息
  updateScreenByPrimaryKey: '/machine/updateScreenByPrimaryKey', // 修改大屏信息
  // 固件更新
  queryUpdateMachineList: '/machine/queryUpdateMachineList', // 查询固件更新列表 分页
  insertMachineUpdateVo: '/machine/insertMachineUpdateVo', // 添加固件更新
  deleteMachineUpdateButch: '/machine/deleteMachineUpdateButch', // 批量删除固件更新
  pushMachineUpdate: '/machine/pushMachineUpdate', // 推送
  queryRedEyeArea: '/machine/queryRedEyeArea', // 推送前获取区域
  // 未绑定终端管理
  queryNoBandingList: '/machine/queryNoBandingList', // 获取未绑定终端列表
  bandingRedEye: '/machine/bandingRedEye', // 绑定赤眸
  // 同步日志
  // 设备重启
  reset: '/terminal/Restart',
  // 人员同步
  synchronization: '/terminal/ManageReflush',
  // 消息中心
  msgCenter: '/notification/getMessageList',
  statAttendStudentInfo: '/attandence/statAttendStudentInfo',
  statAttendInfoByClassId: '/attandence/statAttendInfoByClassId'
}

// 固件更新
function getFormData (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return formData
}
export const insertMachineUpdateVo = function (data) {
  return axios({
    data: getFormData(data),
    url: api.insertMachineUpdateVo,
    method: 'post'
  })
}
export const msgCenter = function (params) {
  return axios({
    params,
    url: api.msgCenter,
    method: 'get'
  })
}
export const statAttendInfoByClassId = function (params) {
  return axios({
    params,
    url: api.statAttendInfoByClassId,
    method: 'get'
  })
}
export const statAttendStudentInfo = function (params) {
  return axios({
    params,
    url: api.statAttendStudentInfo,
    method: 'get'
  })
}
export const deleteMachineUpdateButch = function (data) {
  return axios({
    data,
    url: api.deleteMachineUpdateButch,
    method: 'post'
  })
}
export const pushMachineUpdate = function (data) {
  return axios({
    data,
    url: api.pushMachineUpdate,
    method: 'post'
  })
}
export const queryUpdateMachineList = function (params) {
  return axios({
    params,
    url: api.queryUpdateMachineList,
    method: 'get'
  })
}
export const queryRedEyeArea = function (params) {
  return axios({
    params,
    url: api.queryRedEyeArea,
    method: 'get'
  })
}
// 赤眸管理
// 获取赤眸列表
export const queryRedEyeList = function (params) {
  return axios({
    params,
    url: api.queryRedEyeList,
    method: 'get'
  })
}
// 修改赤眸
export const updateRedEyeButch = function (data) {
  return axios({
    data,
    url: api.updateRedEyeButch,
    method: 'post'
  })
}
// 未绑定终端管理
// 获取未绑定终端列表
export const queryNoBandingList = function (params) {
  return axios({
    params,
    url: api.queryNoBandingList,
    method: 'get'
  })
}
export const deleteRedEyeButch = function (data) {
  return axios({
    data,
    url: api.deleteRedEyeButch,
    method: 'post'
  })
}
export const bandingRedEye = function (data) {
  return axios({
    data,
    url: api.bandingRedEye,
    method: 'post'
  })
}

// 闸机管理
export const insertGateMachine = function (data) {
  return axios({
    data,
    url: api.insertGateMachine,
    method: 'post'
  })
}
// 摄像投管理
export const insertCamera = function (data) {
  return axios({
    data,
    url: api.insertCamera,
    method: 'post'
  })
}
export const deleteCameraByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteCameraByPrimaryKey,
    method: 'post'
  })
}
export const deleteButchCamera = function (data) {
  return axios({
    data,
    url: api.deleteButchCamera,
    method: 'post'
  })
}
export const updateCameraByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateCameraByPrimaryKey,
    method: 'post'
  })
}
export const queryCameraList = function (params) {
  return axios({
    params,
    url: api.queryCameraList,
    method: 'get'
  })
}
// 大屏管理
export const insertScreen = function (data) {
  return axios({
    data,
    url: api.insertScreen,
    method: 'post'
  })
}
export const deleteButchScreen = function (data) {
  return axios({
    data,
    url: api.deleteButchScreen,
    method: 'post'
  })
}
export const updateScreenByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateScreenByPrimaryKey,
    method: 'post'
  })
}
export const deleteScreenByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteScreenByPrimaryKey,
    method: 'post'
  })
}
export const queryScreenList = function (params) {
  return axios({
    params,
    url: api.queryScreenList,
    method: 'get'
  })
}
export const reset = function (params) {
  return axios({
    params,
    url: api.reset,
    method: 'get'
  })
}
export const synchronization = function (params) {
  return axios({
    params,
    url: api.synchronization,
    method: 'get'
  })
}
