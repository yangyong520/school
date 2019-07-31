<template>
  <a-modal
    :maskClosable="false"
    title="归寝分析"
    :footer="null"
    v-model="visibleCheckGUiaiSet">
    <ul class="gui-ul-box">
      <li>
        <span>姓名：</span>
        <span>{{detail.studentVo.studentName}}</span>
      </li>
      <li>
        <span>学号：</span>
        <span>{{detail.studentVo.userNum}}</span>
      </li>
      <li>
        <span>时间</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="LeaveDateSet"
          class="input-box-item breakDataPicker vistorTime"
        />
        <a-button type="primary" @click="GuiaiAnalysis(detail.studentVo.userId)">分析</a-button>
      </li>
      <li>
        <p>共{{dayMount}}天，正常归寝{{normalDay}}天，请假{{begOffDay}}天</p>
        <p>其中：未归次数{{noReturnNumber}}，晚归次数{{lateReturnNumber}}，无记录次数{{noRecordNumber}}</p>
      </li>
    </ul>
  </a-modal>
</template>

<script>
import req from "@/req/req"
const { queryReturnDormAnalyse } = req
export default {
  name: 'analysis-modal',
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      visibleCheckGUiaiSet: false,
      LeaveDateSet: [],
      dayMount: '0', // 分析总共天数
      normalDay: '0', // 分析正常天数
      begOffDay: '0', // 分析请假天数
      noReturnNumber: '0', // 分析未归次数
      lateReturnNumber: '0', // 分析晚归次数
      noRecordNumber: '0', // 分析无记录次数
    }
  },
  methods: {
    GuiaiAnalysis(id) {
      if (this.LeaveDateSet[0] == undefined) {
        this.$message.warning("请选择时间！");
        return;
      }
      var time = this.LeaveDateSet[1] - this.LeaveDateSet[0];
      var intervalTime = time / 86400000 + 1;
      queryReturnDormAnalyse({
        startTime: this.LeaveDateSet[0].format("YYYY-MM-DD"),
        endTime: this.LeaveDateSet[1].format("YYYY-MM-DD"),
        userId: id
      }).then(({ data: { code, msg, data } }) => {
        if (code === 0) {
          this.dayMount = intervalTime; // 分析总共天数
          this.normalDay = data.normalDay ? data.normalDay : 0 // 分析正常天数
          this.begOffDay = data.begOffDay ? data.begOffDay : 0 // 分析请假天数
          this.noReturnNumber = data.noReturnNumber ? data.noReturnNumber : 0 // 分析未归次数
          this.lateReturnNumber = data.lateReturnNumber ? data.lateReturnNumber : 0 // 分析晚归次数
          this.noRecordNumber = data.noRecordNumber ? data.noRecordNumber : 0 // 分析无记录次数
        } else {
          this.$message.warning(msg)
        }
      })
    }
  },
  watch: {
    showModal () {
      this.visibleCheckGUiaiSet = this.showModal
    },
    visibleCheckGUiaiSet () {
      this.$emit('change', this.visibleCheckGUiaiSet)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
