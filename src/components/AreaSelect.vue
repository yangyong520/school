<template>
  <a-select
    v-model="areaId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :disabled="disabled">
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in areaListArr"
      :key="item.id + 'college'"
    >{{item.areaName}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectAreaList } = req;
export default {
  name: "AreaSelect",
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
    },
    showDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areaListArr: [],
      areaId: ""
    };
  },
  methods: {
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaListArr = data
          if (this.showDefault && this.areaListArr.length > 0) {
            this.$emit("changeVal", this.areaListArr[0].id)
          }
        } else {
          $message.error(msg);
        }
      });
    }
  },
  created() {
    this.gatAreaList(); // 获取学院列表
    this.areaId = this.value;
  },
  watch: {
    areaId (newVal, oldVal) {
      this.$emit("changeVal", newVal)
    },
    value(newVal) {
      this.areaId = newVal;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
