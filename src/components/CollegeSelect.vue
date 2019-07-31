<template>
  <a-select
    v-model="collegeId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :mode="checkboxMode"
    :maxTagCount="1"
    placeholder="请选择学院"
    :disabled="disabled"
  >
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in collegeArrList"
      :key="item.id + 'college'"
    >{{item.coName}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectCollege } = req;
export default {
  name: "CollegeSelect",
  props: {
    value: {
      type: String,
    },
    size: {
      type: String,
      default: "small"
    },
    width: {
      type: String
      // default: "100%"
    },
    haveAll: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checkboxMode: {
      type: String,
      default: "default"
    },
    showDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collegeArrList: [],
      collegeId: ""
    };
  },
  methods: {
    gatCollegeClassList() {
      const { $message } = this;
      selectCollege().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArrList = data
          if (this.showDefault && this.collegeArrList.length > 0) {
            this.$emit("changeVal", this.collegeArrList[0].id)
          }
        } else {
          $message.error(msg);
        }
      });
    }
  },
  created() {
    this.collegeId = this.value
    this.gatCollegeClassList() // 获取学院列表
  },
  watch: {
    collegeId (newVal, oldVal) {
      this.$emit("changeVal", newVal);
    },
    value (newVal) {
      this.collegeId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
