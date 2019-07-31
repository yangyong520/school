import axios from '../axios' // 网络请求

const api = {
  // 数据中心
  // 班级管理
  // 学院管理
  insertCollege: '/classes/insertCollege', // 添加学院信息
  updateCollegeByPrimaryKey: '/classes/updateCollegeByPrimaryKey', // 修改学院信息
  queryCollegeList: '/classes/queryCollegeList', // 获取学院信息
  deleteCollegeByPrimaryKey: '/classes/deleteCollegeByPrimaryKey', // 删除学院信息
  deleteButchCollege: '/classes/deleteButchCollege', // 批量删除学院信息
  selectCollegeListByYxAdmin: '/classes/selectCollegeListByYxAdmin', // 获取院系管理员的院系

  // 专业管理
  queryProfessionList: '/classes/queryProfessionList', // 获取专业信息
  insertProfession: '/classes/insertProfession', // 添加专业信息
  selectCollege: '/classes/selectCollege', // 获取学院列表
  updateProfessionByPrimaryKey: '/classes/updateProfessionByPrimaryKey', // 编辑专业信息
  deleteProfessionByPrimaryKey: '/classes/deleteProfessionByPrimaryKey', // 单项删除专业信息
  deleteButchProfession: '/classes/deleteButchProfession', // 批量删除专业信息
  queryProfessionByCollege: '/classes/queryProfessionByCollege', // 批量删除专业信息

  // 年级管理
  queryGradeList: '/classes/queryGradeList', // 获取年级信息
  insertGrade: '/classes/insertGrade', // 添加年级信息
  updateGradeByPrimaryKey: '/classes/updateGradeByPrimaryKey', // 编辑年级信息
  deleteGradeByPrimaryKey: '/classes/deleteGradeByPrimaryKey', // 单项删除年级信息
  deleteButchGrade: '/classes/deleteButchGrade', // 批量删除年级信息

  // 班级管理
  queryClassList: '/classes/queryClassList', // 获取班级信息
  selectClasses: '/classes/selectClasses', // 级联查询班级
  selectGrade: '/classes/selectGrade', // 查询年级列表
  insertClass: '/classes/insertClass', // 添加班级
  updateClassByPrimaryKey: '/classes/updateClassByPrimaryKey', // 编辑班级信息
  deleteClassByPrimaryKey: '/classes/deleteClassByPrimaryKey', // 单项删除班级信息
  deleteButchClass: '/classes/deleteButchClass', // 批量删除班级信息
  queryClassByProfessionAndGradeButch: '/classes/queryClassByProfessionAndGradeButch', // 批量删除班级信息

  // 获取班级在校时间
  queryClassInSchool: '/classes/queryClassInSchool', // 获取班级在校时间
  // 设置班级在校时间
  setClassInSchool: '/classes/setClassInSchool', // 设置班级在校时间

  // 获取班级离校时间
  queryClassOutSchool: '/classes/queryClassOutSchool', // 获取班级离校时间
  // 设置班级离校时间
  setClassOutSchool: '/classes/setClassOutSchool', // 设置班级离校时间

  // 宿管列表
  querySGAdminList: '/user/querySGAdminList', // 获取宿管列表
  insertSGAdmin: '/user/insertSGAdmin', // 添加宿管信息
  updateSGAdminByPrimaryKey: '/user/updateSGAdminByPrimaryKey', // 编辑宿管信息
  deleteSGAdminByPrimaryKey: '/user/deleteSgAdminById', // 删除宿管信息
  deleteButchSGAdmin: '/user/deleteButchSGAdmin', // 批量删除宿管信息

  // 人员管理-其他列表
  queryOtherPeopleList: '/user/queryOtherPeopleList', // 获取其他列表
  insertOtherPeople: '/user/insertOtherPeople', // 添加其他信息
  updateOtherPeopleByPrimaryKey: '/user/updateOtherPeopleByPrimaryKey', // 编辑其他信息
  deleteOtherPeopleByPrimaryKey: '/user/deleteOtherPeopleByPrimaryKey', // 删除其他信息
  deleteButchOtherPeople: '/user/deleteButchOtherPeople', // 批量删除其他信息

  // 黑名单列表
  queryBlackPeopleList: '/user/queryBlackPeopleList', // 获取黑名单列表
  insertBlackPeople: '/user/insertBlackPeople', // 添加黑名单列表
  updateBlackPeopleByPrimaryKey: '/user/updateBlackPeopleByPrimaryKey', // 编辑黑名单信息
  deleteBlackPeopleButch: '/user/deleteBlackPeopleButch', // 批量删除黑名单信息
  deleteBlackPropleByPrimaryKey: '/user/deleteBlackPropleByPrimaryKey', // 单项删除黑名单信息
  // 导出学院查询信息
  exportXY: '/export/queryExportCollege',
  // 导出id
  exportId: '/export/ExportCollege',
  // 考勤分析
  'getAttendStduentList': '/attandence/getAttendStduentList',
  // 通过班级classId查看总的统计信息
  getStatAttendInfoByCount: '/attandence/statAttendInfoByClassId',
  // 通过班级classId 人员信息统计信息 分析
  getStatsInfo: '/attandence/statAttendStudentInfo'
}
// 数据中心
// 班级管理
// 宿管列表
export const querySGAdminList = function (params) {
  return axios({
    params,
    url: api.querySGAdminList,
    method: 'get'
  })
}
export const getStatsInfo = function (params) {
  return axios({
    params,
    url: api.getStatsInfo,
    method: 'get'
  })
}
export const getStatAttendInfoByCount = function (params) {
  return axios({
    params,
    url: api.getStatAttendInfoByCount,
    method: 'get'
  })
}
export const getAttendStduentList = function (params) {
  return axios({
    params,
    url: api.getAttendStduentList,
    method: 'get'
  })
}
// 添加宿管信息
export const insertSGAdmin = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.insertSGAdmin,
    method: 'post'
  })
}
// 编辑宿管信息
export const updateSGAdminByPrimaryKey = function (data) {
  // const formData = new FormData()
  // for (let key in data) {
  //   formData.append(key, data[key])
  // }
  return axios({
    data,
    url: api.updateSGAdminByPrimaryKey,
    method: 'post'
  })
}

// 删除宿管信息
export const deleteSGAdminByPrimaryKey = function (params) {
  return axios({
    params,
    url: api.deleteSGAdminByPrimaryKey,
    method: 'get'
  })
}
// 批量删除宿管信息
export const deleteButchSGAdmin = function (data) {
  return axios({
    data,
    url: api.deleteButchSGAdmin,
    method: 'post'
  })
}

// 其他管理

// 其他列表
export const queryOtherPeopleList = function (params) {
  return axios({
    params,
    url: api.queryOtherPeopleList,
    method: 'get'
  })
}
// 添加其他信息
export const insertOtherPeople = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.insertOtherPeople,
    method: 'post'
  })
}
// 编辑其他信息
export const updateOtherPeopleByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateOtherPeopleByPrimaryKey,
    method: 'post'
  })
}

// 删除其他信息
export const deleteOtherPeopleByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteOtherPeopleByPrimaryKey,
    method: 'post'
  })
}
// 批量删除其他信息
export const deleteButchOtherPeople = function (data) {
  return axios({
    data,
    url: api.deleteButchOtherPeople,
    method: 'post'
  })
}
// 黑名单
// 黑名单列表
export const queryBlackPeopleList = function (params) {
  return axios({
    params,
    url: api.queryBlackPeopleList,
    method: 'get'
  })
}
// 添加黑名单信息
export const insertBlackPeople = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.insertBlackPeople,
    method: 'post'
  })
}
// 编辑黑名单信息
export const updateBlackPeopleByPrimaryKey = function (data) {
  const formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios({
    data: formData,
    url: api.updateBlackPeopleByPrimaryKey,
    method: 'post'
  })
}
// 单项删除黑名单信息
export const deleteBlackPropleByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteBlackPropleByPrimaryKey,
    method: 'post'
  })
}
// 批量删除黑名单信息
export const deleteBlackPeopleButch = function (data) {
  return axios({
    data,
    url: api.deleteBlackPeopleButch,
    method: 'post'
  })
}

// 学院管理
// 添加学院信息
export const insertCollege = function (data) {
  return axios({
    data,
    url: api.insertCollege,
    method: 'post'
  })
}
// 修改学院信息
export const updateCollegeByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateCollegeByPrimaryKey,
    method: 'post'
  })
}
// 获取学院信息
export const queryCollegeList = function (params) {
  return axios({
    params,
    url: api.queryCollegeList,
    method: 'get'
  })
}
export const selectCollegeListByYxAdmin = function (params) {
  return axios({
    params,
    url: api.selectCollegeListByYxAdmin,
    method: 'get'
  })
}
// 删除学院信息
export const deleteCollegeByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteCollegeByPrimaryKey,
    method: 'post'
  })
}
// 批量删除学院信息
export const deleteButchCollege = function (data) {
  return axios({
    data,
    url: api.deleteButchCollege,
    method: 'post'
  })
}
// 学院管理

// 专业管理
// 获取专业信息
export const queryProfessionList = function (params) {
  return axios({
    params,
    url: api.queryProfessionList,
    method: 'get'
  })
}
export const queryProfessionByCollege = function (data) {
  return axios({
    data,
    url: api.queryProfessionByCollege,
    method: 'post'
  })
}
// 添加专业信息
export const insertProfession = function (data) {
  return axios({
    data,
    url: api.insertProfession,
    method: 'post'
  })
}
// 获取专业列表
export const selectCollege = function (params) {
  return axios({
    params,
    url: api.selectCollege,
    method: 'get'
  })
}
// 编辑专业信息
export const updateProfessionByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateProfessionByPrimaryKey,
    method: 'post'
  })
}
// 单项删除专业信息
export const deleteProfessionByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteProfessionByPrimaryKey,
    method: 'post'
  })
}
// 批量删除专业信息
export const deleteButchProfession = function (data) {
  return axios({
    data,
    url: api.deleteButchProfession,
    method: 'post'
  })
}
// 专业管理

// 年级管理
// 获取年级管理
export const queryGradeList = function (params) {
  return axios({
    params,
    url: api.queryGradeList,
    method: 'get'
  })
}
// 添加年级管理
export const insertGrade = function (data) {
  return axios({
    data,
    url: api.insertGrade,
    method: 'post'
  })
}
// 编辑年级管理
export const updateGradeByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateGradeByPrimaryKey,
    method: 'post'
  })
}
// 单项删除年级管理
export const deleteGradeByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteGradeByPrimaryKey,
    method: 'post'
  })
}
// 批量删除年级管理
export const deleteButchGrade = function (data) {
  return axios({
    data,
    url: api.deleteButchGrade,
    method: 'post'
  })
}

// 班级管理
// 获取班级管理
export const queryClassList = function (params) {
  return axios({
    params,
    url: api.queryClassList,
    method: 'get'
  })
}
// 级联查询班级
export const selectClasses = function (params) {
  return axios({
    params,
    url: api.selectClasses,
    method: 'get'
  })
}
// 查询年级列表
export const selectGrade = function (params) {
  return axios({
    params,
    url: api.selectGrade,
    method: 'get'
  })
}
// 添加班级
export const insertClass = function (data) {
  return axios({
    data,
    url: api.insertClass,
    method: 'post'
  })
}
// 编辑班级
export const updateClassByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.updateClassByPrimaryKey,
    method: 'post'
  })
}
// 单项删除班级信息
export const deleteClassByPrimaryKey = function (data) {
  return axios({
    data,
    url: api.deleteClassByPrimaryKey,
    method: 'post'
  })
}
// 批量删除班级信息
export const deleteButchClass = function (data) {
  return axios({
    data,
    url: api.deleteButchClass,
    method: 'post'
  })
}
// 获取班级在校时间
export const queryClassInSchool = function (params) {
  return axios({
    params,
    url: api.queryClassInSchool,
    method: 'get'
  })
}
// 设置班级在校时间
export const setClassInSchool = function (data) {
  return axios({
    data,
    url: api.setClassInSchool,
    method: 'post'
  })
}
export const queryClassByProfessionAndGradeButch = function (data) {
  return axios({
    data,
    url: api.queryClassByProfessionAndGradeButch,
    method: 'post'
  })
}
// 获取班级离校时间
export const queryClassOutSchool = function (params) {
  return axios({
    params,
    url: api.queryClassOutSchool,
    method: 'get'
  })
}
// 设置班级离校时间
export const setClassOutSchool = function (data) {
  return axios({
    data,
    url: api.setClassOutSchool,
    method: 'post'
  })
}

export const exportXY = function (data) {
  return axios({
    data,
    url: api.exportXY,
    method: 'post'
  })
}

export const exportId = function (params) {
  return axios({
    params,
    url: api.exportId,
    method: 'get'
  })
}
