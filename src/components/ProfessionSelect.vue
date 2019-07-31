<template>
  <a-select
    v-model="professionId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    placeholder="请选择专业"
    :disabled="disabled">
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in professionArrList"
      :key="item.id + 'profession'"
    >{{item.proName}}</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectClasses } = req;
export default {
  name: "ProfessionSelect",
  props: {
    value: {
      type: String
    },
    collegeId: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String
      // default: "100%"
    },
    haveAll: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      professionArrList: [],
      professionId: ""
    };
  },
  methods: {
    getProfessionArrList() {
      this.professionArrList = []
      const { collegeId } = this
      this.professionId = ""
      if (this.haveAll) {
        this.professionId = "all";
      }
      if (!collegeId) {
        return;
      }
      selectClasses({
        collegeId
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.professionArrList = data.professionList;
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
    this.getProfessionArrList()
    this.professionId = this.value
  },
  watch: {
    collegeId () {
      // if (this.professionId) {
      this.getProfessionArrList()
      // }
    },
    professionId (newVal, oldVal) {
      if (this.professionId) {
        this.$emit("changeVal", newVal)
      }
    },
    value (newVal) {
      this.professionId = newVal
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
