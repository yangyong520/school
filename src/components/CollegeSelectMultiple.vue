<template>
  <a-select
    v-model="collegeId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    @change="change"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    placeholder="请选择学院"
    :disabled="disabled"
    mode="multiple"
    :maxTagCount="1">
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
import { multipleSelect } from './multipleSelectMixin'
const { selectCollege } = req;
export default {
  name: "CollegeSelect",
  mixins: [multipleSelect],
  props: {
    value: {
      type: Array
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
    }
  },
  data() {
    return {
      collegeArrList: [],
      collegeId: [],
    };
  },
  methods: {
    gatCollegeClassList() {
      const { $message } = this;
      selectCollege().then(({ data: { code, data = [], msg } }) => {
        if (code === 0) {
          this.collegeArrList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    lengStr(omittedValues,a,b){
      return 888
    },
    change (value, option) {
      if (value.length < 1) {
        this.collegeId = []
        return
      }
      if (value[0] === 'all') {
        if (value.length < 2) {
          this.collegeId = value
          return
        } else {
          this.collegeId = [value[1]]
          return
        }
      }
      if (value[0] !== 'all' && value.some(ele => ele === 'all')) {
        this.collegeId = ['all']
      }
    }
  },
  created() {
    this.gatCollegeClassList(); // 获取学院列表
    this.collegeId = this.value;
  },
  watch: {
    collegeId () {
      this.$emit('changeVal', this.collegeId)
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
