import axios from '../axios' // 网络请求

const api = {
  // 人员管理
  // 学生管理
  insertStudent: '/user/insertStudent', // 添加学生信息
  updateStudentByPrimaryKey: '/user/updateStudentByPrimaryKey', // 修改学生信息
  deleteStudentByPrimaryKey: '/user/deleteStudentByPrimaryKey', // 主键删除学生信息
  deleteButchStudent: '/user/deleteButchStudent', // 批量删除学生信息
  queryStudentList: '/user/queryStudentList', // 查询学生信息列表 分页
  selectMzList: '/user/selectMzList', // 获取民族
  selectBedByRoomId: '/area/selectBedByRoomId', // 获取班级
  // 辅导员
  insertTeacher: '/user/insertTeacher', // 添加辅导员
  queryTeacherList: '/user/queryTeacherList', // 添加辅导员
  deleteButchTeacher: '/user/deleteButchTeacher', // 批量删除教师信息
  updateTeacherByPrimaryKey: '/user/updateTeacherByPrimaryKey', // 修改教师信息
  deleteTeacherByPrimaryKey: '/user/deleteTeacherById', // 删除教师信息
  // 导入
  uploadBlack: '/importData/batchImportBlackUserInfo',
  // 其他人设置身份
  setDignity: '/user/changeUserType',
  // 人脸检索接口
  faceSearch: '/user/findFaceBySearch',
  getFaceDetail: '/user/findOneByLinkId'
}

// 人员管理
function getFormData (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return formData
}
export const insertStudent = function (data) {
  return axios({
    data: getFormData(data),
    url: api.insertStudent,
    method: 'post'
  })
}
export const faceSearch = function (data) {
  return axios({
    data: getFormData(data),
    url: api.faceSearch,
    method: 'post'
  })
}
export const selectBedByRoomId = function (params) {
  return axios({
    params,
    url: api.selectBedByRoomId,
    method: 'get'
  })
}
export const getFaceDetail = function (params) {
  return axios({
    params,
    url: api.getFaceDetail,
    method: 'get'
  })
}
export const setDignity = function (data) {
  return axios({
    data,
    url: api.setDignity,
    method: 'post'
  })
}
export const updateStudentByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateStudentByPrimaryKey,
    method: 'post'
  })
}
export const deleteStudentByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteStudentByPrimaryKey,
    method: 'post'
  })
}
export const deleteButchStudent = function (data) {
  return axios({
    data,
    url: api.deleteButchStudent,
    method: 'post'
  })
}
export const queryStudentList = function (params) {
  return axios({
    params,
    url: api.queryStudentList,
    method: 'get'
  })
}
export const selectMzList = function (params) {
  return axios({
    params,
    url: api.selectMzList,
    method: 'get'
  })
}
// 辅导员
export const insertTeacher = function (data) {
  return axios({
    data: getFormData(data),
    url: api.insertTeacher,
    method: 'post'
  })
}
export const deleteButchTeacher = function (data) {
  return axios({
    data,
    url: api.deleteButchTeacher,
    method: 'post'
  })
}
export const updateTeacherByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateTeacherByPrimaryKey,
    method: 'post'
  })
}
export const deleteTeacherByPrimaryKey = function (params) {
  return axios({
    params,
    url: api.deleteTeacherByPrimaryKey,
    method: 'get'
  })
}
export const queryTeacherList = function (params) {
  return axios({
    params,
    url: api.queryTeacherList,
    method: 'get'
  })
}

export const uploadBlack = function (data) {
  return axios({
    data,
    url: api.uploadBlack,
    method: 'post'
  })
}
