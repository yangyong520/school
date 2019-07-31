<template>
  <a-select
    v-model="nationId"
    :disabled="disabled"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}">
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.mzId"
      v-for="item in nationListArr"
      :key="item.id + 'college'"
    >{{item.mzname}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectMzList } = req;
export default {
  name: "NationSelect",
  props: {
    value: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    width: {
      type: String
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
      nationListArr: [],
      nationId: ""
    };
  },
  methods: {
    getNationList() {
      // 获取民族
      selectMzList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.nationListArr = data;
        }
      });
    }
  },
  created() {
    this.getNationList(); // 获取学院列表
    this.nationId = this.value;
  },
  watch: {
    nationId(newVal, oldVal) {
      this.$emit("changeVal", newVal);
    },
    value(newVal) {
      this.nationId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>

