<template>
  <div>
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="rowSelection"
        :columns="columns"
        :dataSource="dataTable"
        :pagination="false"
        :rowKey="rowKey">
      </a-table>
    </a-spin>
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :current="pageinfo.pageNum"
        :total="pageinfo.totalElements"
        showSizeChanger
        showQuickJumper
        :pageSize="pageinfo.pageSize"
        @change="changePage"
        @showSizeChange="changeSize"
      />
    </div>
  </div>
</template>

<script>
import req from "@/req/req";
const {
  sycLogs,
  ErrorList,
  getAttendStduentList,
  msgCenter,
  getOutBedStudentInfoBySgList,
  getOutBedStudentInfoByTeacherList,
  queryBlackInOutRecodeList, // 黑名单记录
  queryShadowList, // 尾随
  queryInOutRecordList, // 连进连出
  queryThrowOverRecordList, // 翻越
  queryNoRecordList, // 无记录
  queryLateReturnList, // 晚归
  queryNoReturnList, // 未归
  queryVisitTimeOutList, // 访客超时
  queryReturnDormList, // 归寝记录
  unusualList, // 异常名单
  queryCollegeList, // 学院管理
  queryProfessionList, // 专业管理
  queryGradeList, // 获取年级
  queryBedList, // 床位管理
  queryRoomList, // 房间管理
  queryAreaList, // 区域管理
  queryClassList, // 考勤分析、班级列表
  queryInOutList, // 出入记录
  queryBuildList, // 归寝规则
  queryStudentList, // 学生列表
  queryOtherPeopleList, // 其他人员列表
  queryBlackPeopleList, // 黑名单
} = req

export default {
  name: 'data-table',
  props: {
    // 是否显示选择按钮
    showRowSelection: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 键，唯一标识
    rowKey: {
      type: String,
      default: 'id'
    },
    // 必须写type, 再下面判断接口
    reqType: String,
    // 传来的数据
    queryObj: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 10,
        }
      }
    }
  },
  data () {
    return {
      dataTable: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      },
      spinning: true,
      selectedRowKeys: []
    }
  },
  computed: {
    reqData () {
      if (this.reqType) {
        return {
          'error': ErrorList,
          'sync': sycLogs,
          'attandence': getAttendStduentList,
          'msg': msgCenter,
          'guiai': queryReturnDormList,
          'rule': queryBuildList,
          'come': queryInOutList,
          'attend': queryClassList,
          'region': queryAreaList,
          'ban': queryBuildList,
          'room': queryRoomList,
          'bed': queryBedList,
          'college': queryCollegeList,
          'major': queryProfessionList,
          'grade': queryGradeList,
          'classes': queryClassList,
          'stu': queryStudentList,
          'other': queryOtherPeopleList,
          'blackPer': queryBlackPeopleList,
          'unusual': unusualList,
          'visList': queryVisitTimeOutList,
          'notes': queryNoReturnList,
          'late': queryLateReturnList,
          'noLogs': queryNoRecordList,
          'inOut': queryInOutRecordList,
          'surmount': queryThrowOverRecordList,
          'trailing': queryShadowList,
          'blackInOut': queryBlackInOutRecodeList,
          'cycle': getOutBedStudentInfoBySgList,
          'cycleAss': getOutBedStudentInfoByTeacherList
        }[this.reqType]
      }
    },
    rowSelection () {
      const { selectedRowKeys } = this
      if (this.showRowSelection) {
        return {
          selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
      return null
    }
  },
  mounted () {
    this.getDataTable()
  },
  methods: {
    refresh () {
      this.getDataTable()
      this.selectedRowKeys = []
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('change', this.selectedRowKeys)
    },
    getDataTable () {
      const params = this.queryObj
      params.pageNum = this.pageinfo.pageNum || 1
      params.pageSize = this.pageinfo.pageSize || 10
      this.reqData(params).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          this.dataTable = data && data.content ? data.content : []
          if (data && data.pageinfo) {
            this.pageinfo = data.pageinfo
          }
          this.spinning = false
        } else {
          this.$message.warning(msg)
        }
      }, () => {
        this.spinning = false
      })
      // this.spinning = false
    },
    // 切换页数
    changePage (page, pageSize) {
      this.pageinfo.pageNum = page
      this.getDataTable()
    },
    changeSize (page, pageSize) {
      this.pageinfo.pageSize = pageSize
      this.pageinfo.pageNum = 1
      this.getDataTable()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
