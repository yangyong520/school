<template>
  <a-modal
    :maskClosable="false"
    title="信息详情"
    v-model="visibleGUiaiLook"
    :footer="null"
    class="modal-box">
    <div class="visible-notes-img">
      <img :src="detail.studentVo.userPicth" alt>
    </div>
    <div class="visibleNotesDeail">
      <div class="visibleNotesDeailDiv" style="width: 45%">
        <label>姓名：</label>
        <span>{{detail.studentVo.studentName}}</span>
      </div>
      <div class="visibleNotesDeailDiv" style="width: 55%">
        <label>学号：</label>
        <span>{{detail.studentVo.userNum}}</span>
      </div>
      <div class="visibleNotesDeailDiv" style="width: 45%">
        <label>性别：</label>
        <span>{{detail.studentVo.sex}}</span>
      </div>
      <div class="visibleNotesDeailDiv" style="width: 55%">
        <label>手机号码：</label>
        <span>{{detail.studentVo.phone}}</span>
      </div>
      <div class="visibleNotesDeailDiv" style="width: 45%">
        <label>辅导员：</label>
        <span>{{detail.studentVo.teacherName}}</span>
      </div>
      <div class="visibleNotesDeailDiv" style="width: 55%">
        <label>手机号码：</label>
        <span>{{detail.studentVo.teacherPhone}}</span>
      </div>
      <div class="visibleNotesDeailDivP">
        <label>班级信息：</label>
        <span>{{detail.studentVo.collegeName}}-{{detail.studentVo.proName}}-20{{detail.studentVo.gradeName}}级-{{detail.studentVo.className}}班</span>
      </div>
      <div class="visibleNotesDeailDivP">
        <label>房间信息：</label>
        <span>
          {{detail.studentVo.areaName}}-
          {{detail.studentVo.buildName}}-
          {{detail.studentVo.roomNum ? detail.studentVo.roomNum + '室-' : ''}}
          {{detail.studentVo.bedNum  ? detail.studentVo.bedNum + '号床' : ''}}
        </span>
      </div>
    </div>
    <div class="clearfix"></div>
  </a-modal>
</template>

<script>
import req from "@/req/req"
const { selectBuildList } = req
export default {
  name: 'per-modal',
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
      visibleGUiaiLook: false,
    }
  },
  mounted () {
    this.visibleGUiaiLook = this.showModal
  },
  methods: {

  },
  watch: {
    showModal () {
      this.visibleGUiaiLook = this.showModal
    },
    visibleGUiaiLook () {
      this.$emit('change', this.visibleGUiaiLook)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

</style>
