<template>
  <a-select
    v-model="collegeId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :mode="checkboxMode"
    placeholder="请选择学院"
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
const { selectCollegeListByYxAdmin } = req;
export default {
  name: "CollegeSelect",
  props: {
    value: {},
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
    checkboxMode: {
      type: String,
      default: "default"
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
      selectCollegeListByYxAdmin().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArrList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    // lietToArr(val){

    // }
  },
  created() {
    this.gatCollegeClassList(); // 获取学院列表
    this.collegeId = this.value;
  },
  watch: {
    collegeId(newVal, oldVal) {
      this.$emit("changeVal", newVal);
    },
    value(newVal) {
      this.collegeId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
