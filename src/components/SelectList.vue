<template>
  <div></div>
</template>

<script>
import req from "@/req/req";
const {
  selectAreaList, // 查询区域列表
  selectBuildList, // 获取楼栋
  selectCollege, // 查询学院列表
  selectClasses, // 查询专业列表
  selectGrade // 查询年级列表
} = req;
export default {
  name: 'select-list',
  data () {
    return {
      buildId: '',
      gradeId: '',
      classId: 'all',
      proId: 'all',
      collegeId: '',
      areaList: [],
      buildIdList: [],
      collegeArrList: [],
      professionArrList: [],
      gradeArrList: [],
      classList: []
    }
  },
  methods: {
    // 查询区域列表
    gatAreaList () {
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaList = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 查询楼栋列表
    handleChangeArea (id) {
      this.buildId = ''
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildIdList = data
        }
      })
    },
    // 查询学院列表
    gatCollegeClassList () {
      selectCollege().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArrList = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 筛选专业
    seachprofessionList (id) {
      this.proId = 'all'
      selectClasses({
        collegeId: id
      }).then(({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.professionArrList = data.professionList
          } else {
            this.$message.warning(msg)
          }
        },
        () => {
          this.$message.warning(msg)
        }
      )
    },
    // 查询年级
    gradeList () {
      this.gradeId = ''
      selectGrade().then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.gradeArrList = data
          } else {
            this.$message.warning(msg)
          }
        },
        () => {
          this.$message.warning(msg)
        }
      )
    },
    // 查询班级
    seachClass () {
      this.classId = 'all'
      this.classList = []
      selectClasses({
        collegeId: this.collegeId,
        professionId: this.proId,
        gradeId: this.gradeId
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.classList = data.classesList
          } else {
            this.$message.warning(msg)
          }
        },
        () => {
          this.$message.warning(msg)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
