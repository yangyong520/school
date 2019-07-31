<template>
  <a-select
    v-model="gradeId"
    :dropdownStyle="{zIndex: 10002}"
    :style="{width}"
    :size="size"
    class="input-select"
    placeholder="请选择年级"
    :disabled="disabled"
  >
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in gradeArrList"
      :key="item.id + 'grade'"
    >20{{item.gradeNum}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectGrade } = req;
export default {
  name: "GradeSelect",
  props: {
    value: {
      type: String
    },
    changeCallback: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    width: {
      type: String
      // default: "100%"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    haveAll: {
      type: Boolean,
      default: false
    },
    showDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gradeArrList: [],
      gradeId: ""
    };
  },
  methods: {
    getGradeList() {
      this.gradeId = "";
      if(this.haveAll){
        this.gradeId = "all"
      }
      selectGrade({}).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.gradeArrList = data
            if (this.showDefault && this.gradeArrList.length > 0) {
              this.$emit("changeVal", this.gradeArrList[0].id)
            }
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    }
  },
  created() {
    this.getGradeList(); // 获取学院列表
    this.gradeId = this.value;
  },
  watch: {
    gradeId(newVal, oldVal) {
      // this.changeCallback()
      if (this.gradeId) {
        this.$emit("changeVal", newVal);
      }
    },
    value (newVal) {
      this.gradeId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
