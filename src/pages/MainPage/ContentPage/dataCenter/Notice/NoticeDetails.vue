<template>
  <a-modal :maskClosable="false" title="添加" v-model="visible" @ok="handleOk" okText="确定">
    <div>
      <hr>
      <p>发布时间：{{moment(showObj.sendTime).format("llll")}}</p>
      <!-- <div v-html="targetPerson"></div> -->
      <div>
        <div>发布对象:</div>
        <div>
          <span>{{showObj.areaName ? (showObj.areaName + '-') : ''}}</span>
          <span v-for="(item, index) in showObj.collegeName" :key="index">{{item.collegeName ? (item.collegeName + '、') : ''}}</span>
          <span>{{showObj.buildName ? (showObj.buildName + '-') : ''}}</span>
          <span v-for="(item, index) in showObj.professionName" :key="`pro-${index}`">{{item.proName ? item.proName : ''}}</span>
          <span v-for="(item, index) in showObj.gradeName" :key="`gra-${index}`">{{item.gradeNum ? (item.gradeNum + '级、') : ''}}</span>
          <span v-for="(item, index) in showObj.className" :key="`cl-${index}`">{{item.clName ? (item.clName + '班、') : ''}}</span>
          <span>{{showObj.roleName !== '-1' ? (showObj.roleName + '-') : ''}}</span>
          <span>{{showObj.nation ? (showObj.nation + '-') : ''}}</span>
          <span>{{showObj.education !== '-1' ? getEducation(showObj.education) : ''}}</span>
          <span v-if="showObj.sex">{{showObj.sex}}</span>
          <span>{{showObj.roomName ? (showObj.roomName + '-') : ''}}</span>
          <span>{{showObj.floorId !== '-1' ? showObj.floorId : ''}}</span>
          <span>{{targetPerson}}</span>
        </div>
      </div>
      <hr>
      <h1 :style="{fontSize: '20px',textAlign: 'center'}">{{showObj.title}}</h1>
      <div v-html="showObj.content"></div>
    </div>
  </a-modal>
</template>

<script>
import moment from "moment";
export default {
  name: "notice-detail",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    showObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      visible: false,
      data: "<span>111<span>"
    };
  },
  computed: {
    targetPerson() {
      const {
        showObj: {
          areaId,
          areaName,
          collegeName,
          professionName,
          gradeName,
          className,
          roleName = "",
          education = "",
          nation = "",
          sex = "",
        }
      } = this;
      let str = ''
      if (professionName && gradeName && collegeName && className && roleName === '-1' && education === '-1' && sex === -1) {
        if (professionName.every(ele => ele.id === "-1") && gradeName.every(ele => ele.id === "-1") || collegeName.every(ele => ele.collegeId === "-1") || className.every(ele => ele.id === "-1")) {
          str = '所有人员'
        }
      }
      return str;
    }
  },
  methods: {
    handleOk() {
      this.$emit("okForm", this);
    },
    getEducation(education) {
      if (education === "0") {
        return "大专-";
      } else if (education === "1") {
        return "本科-";
      } else if (education === "2") {
        return "研究生-";
      } else if (education === "3") {
        return "博士-";
      } else {
        return "";
      }
    },
    moment
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible(newVal) {
      this.$emit("cgModal", newVal);
    },
    visibleContry(newVal) {
      this.visible = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
