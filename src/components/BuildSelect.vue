<template>
  <a-select
    v-model="buildId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    :disabled="disabled"
  >
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in buildListArr"
      :key="item.id + 'profession'"
    >{{item.buildName}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectBuildList } = req;
export default {
  name: "BuildSelect",
  props: {
    value: {
      type: String
    },
    areaId: {
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
      buildListArr: [],
      buildId: ""
    };
  },
  methods: {
    getBuildList() {
      const { areaId } = this;
      this.buildId = "";
      if (this.haveAll) {
        this.buildId = "all";
      }
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArr = data;
          if (this.showDefault && this.buildListArr.length > 0) {
            this.$emit("changeVal", this.buildListArr[0].id);
          }
        }
      });
    }
  },
  computed: {
    getBuildObj() {
      const { buildListArr } = this;
      let obj = {};
      buildListArr.forEach(ele => {
        if (ele.id === this.buildId) {
          obj = ele;
        }
      });
      return obj;
    }
  },
  created() {
    this.getBuildList();
    this.buildId = this.value;
  },
  watch: {
    areaId() {
      if (this.areaId) {
        this.getBuildList()
      }
    },
    buildId(newVal, oldVal) {
      if (this.buildId) {
        this.$emit("changeVal", newVal)
      }
    },
    getBuildObj(newVal) {
      this.$emit("getObj", newVal);
    },
    value(newVal) {
      this.buildId = newVal;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
