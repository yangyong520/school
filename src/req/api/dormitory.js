import axios from '../axios' // 网络请求

const api = {
  // 数据中心
  // 宿舍管理
  // 区域
  insertArea: '/area/insertArea', // 添加区域信息
  queryAreaList: '/area/queryAreaList', // 获取区域信息 分页
  selectAreaList: '/area/selectAreaList', // 获取区域信息 全部
  deleteAreaByPrimaryKey: '/area/deleteAreaByPrimaryKey', // 主键删除区域信息
  deleteButchArea: '/area/deleteButchArea', // 批量删除区域信息
  updateAreaByPrimaryKey: '/area/updateAreaByPrimaryKey', // 修改区域信息
  // 楼栋管理
  insertBuild: '/area/insertBuild', // 添加楼栋信息
  deleteButchBuild: '/area/deleteButchBuild', // 批量删除楼栋信息
  queryBuildList: '/area/queryBuildList', // 查询楼栋信息列表 分页
  selectBuildList: '/area/selectBuildList', // 查询楼栋信息列表 全部
  deleteBuildByPrimaryKey: '/area/deleteBuildByPrimaryKey', // 主键删除楼栋信息
  updateBuildByPrimaryKey: '/area/updateBuildByPrimaryKey', // 修改楼栋信息
  // 房间管理
  insertRoom: '/area/insertRoom', // 添加宿舍信息
  deleteButchRoom: '/area/deleteButchRoom', // 批量删除宿舍信息
  queryRoomList: '/area/queryRoomList', // 查询宿舍信息列表 分页
  deleteRoomByPrimaryKey: '/area/deleteRoomByPrimaryKey', // 主键删除宿舍信息
  updateRoomByPrimaryKey: '/area/updateRoomByPrimaryKey', // 修改宿舍信息
  selectRoomList: '/area/selectRoomList', // 获查询房间信息列表取
  // 床位管理
  insertBed: '/area/insertBed', // 添加床位信息
  deleteButchBed: '/area/deleteButchBed', // 批量删除床位信息
  deleteBedByPrimaryKey: '/area/deleteBedByPrimaryKey', // 添加床位信息
  updateBedByPrimaryKey: '/area/updateBedByPrimaryKey', // 修改床位信息
  selectBedList: '/area/selectBedList', // 查询床位信息列表
  queryBedList: '/area/queryBedList', // 查询床位信息列表 分页
  selectBedByRoomId: '/area/selectBedByRoomId', // 获取房间
  LayBackBed: '/area/LayBackBed', // 退寝
  changeDorm: '/area/changeDorm', // 调寝
  selectStudentByBedId: '/area/selectStudentByBedId', // 根据床位获取学生信息
  fileUpload: '/importData/batchImportAreaInfo',
  // 第一步筛选床位
  queryAssignDormList: '/area/queryAssignDormList',
  // 筛选人
  queryAssignStudentList: '/area/queryAssignStudentList',
  // 床位分配
  postAssignDormList: '/area/bedAllocation',
  getFoolr: '/area/queryFloorByBuild'
}

// 数据中心
// 宿舍管理
// 区域
export const insertArea = function (data) {
  return axios({
    data,
    url: api.insertArea,
    method: 'post'
  })
}
export const queryAreaList = function (params) {
  return axios({
    params,
    url: api.queryAreaList,
    method: 'get'
  })
}
export const getFoolr = function (params) {
  return axios({
    params,
    url: api.getFoolr,
    method: 'get'
  })
}
export const selectAreaList = function (params) {
  return axios({
    params,
    url: api.selectAreaList,
    method: 'get'
  })
}
export const deleteAreaByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteAreaByPrimaryKey,
    method: 'post'
  })
}
export const deleteButchArea = function (data) {
  return axios({
    data,
    url: api.deleteButchArea,
    method: 'post'
  })
}
export const updateAreaByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateAreaByPrimaryKey,
    method: 'post'
  })
}
// 楼栋管理
export const insertBuild = function (data) {
  return axios({
    data,
    url: api.insertBuild,
    method: 'post'
  })
}
export const deleteButchBuild = function (data) {
  return axios({
    data,
    url: api.deleteButchBuild,
    method: 'post'
  })
}
export const queryBuildList = function (params) {
  return axios({
    params,
    url: api.queryBuildList,
    method: 'get'
  })
}
export const selectBuildList = function (params) {
  return axios({
    params,
    url: api.selectBuildList,
    method: 'get'
  })
}
export const deleteBuildByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteBuildByPrimaryKey,
    method: 'post'
  })
}
export const updateBuildByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateBuildByPrimaryKey,
    method: 'post'
  })
}
// 房间管理
export const insertRoom = function (data) {
  return axios({
    data,
    url: api.insertRoom,
    method: 'post'
  })
}
export const deleteButchRoom = function (data) {
  return axios({
    data,
    url: api.deleteButchRoom,
    method: 'post'
  })
}
export const queryRoomList = function (params) {
  return axios({
    params,
    url: api.queryRoomList,
    method: 'get'
  })
}
export const deleteRoomByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteRoomByPrimaryKey,
    method: 'post'
  })
}
export const updateRoomByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateRoomByPrimaryKey,
    method: 'post'
  })
}
export const selectRoomList = function (params) {
  return axios({
    params,
    url: api.selectRoomList,
    method: 'get'
  })
}
// 床位管理
export const insertBed = function (data) {
  return axios({
    data,
    url: api.insertBed,
    method: 'post'
  })
}
export const deleteButchBed = function (data) {
  return axios({
    data,
    url: api.deleteButchBed,
    method: 'post'
  })
}
export const deleteBedByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteBedByPrimaryKey,
    method: 'post'
  })
}
export const updateBedByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateBedByPrimaryKey,
    method: 'post'
  })
}
export const selectBedList = function (params) {
  return axios({
    params,
    url: api.selectBedList,
    method: 'get'
  })
}
export const queryBedList = function (params) {
  return axios({
    params,
    url: api.queryBedList,
    method: 'get'
  })
}
export const selectBedByRoomId = function (params) {
  return axios({
    params,
    url: api.selectBedByRoomId,
    method: 'get'
  })
}
export const LayBackBed = function (data) {
  return axios({
    data,
    url: api.LayBackBed,
    method: 'post'
  })
}
export const changeDorm = function (data) {
  return axios({
    data,
    url: api.changeDorm,
    method: 'post'
  })
}
export const selectStudentByBedId = function (params) {
  return axios({
    params,
    url: api.selectStudentByBedId,
    method: 'get'
  })
}

export const fileUpload = function (data) {
  return axios({
    data,
    url: api.fileUpload,
    method: 'post'
  })
}

export const queryAssignDormList = function (params) {
  return axios({
    params,
    url: api.queryAssignDormList,
    method: 'get'
  })
}

export const queryAssignStudentList = function (params) {
  return axios({
    params,
    url: api.queryAssignStudentList,
    method: 'get'
  })
}

export const postAssignDormList = function (data) {
  return axios({
    data,
    url: api.postAssignDormList,
    method: 'post'
  })
}
