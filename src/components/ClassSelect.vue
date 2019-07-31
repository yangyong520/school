<template>
  <a-select
    v-model="classId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    placeholder="请选择班级"
    class="input-select"
    :style="{width}"
    :disabled="disabled"
  >
    <a-select-option v-if="haveAll" value="all">全部</a-select-option>
    <a-select-option
      :value="item.id"
      v-for="item in classesList"
      :key="item.id + 'classId'"
    >{{item.clName}}班</a-select-option>
  </a-select>
</template>

<script>
import req from "@/req/req";
const { selectClasses } = req;
export default {
  name: "ClassSelect",
  props: {
    value: {
      type: String
    },
    professionId: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    gradeId: {
      type: String
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
    }
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      classId: "",
      classesList: []
    };
  },
  methods: {
    getClassList() {
      const { gradeId, professionId } = this;
      this.classId = "";
      if(this.haveAll){
        this.classId = "all"
      }
      selectClasses({
        professionId,
        gradeId
      }).then(
        ({
          data: {
            code,
            msg,
            data: { classesList = [] }
          }
        }) => {
          if (code === 0) {
            this.classesList = classesList;
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    }
  },
  created() {
    this.getClassList();
    this.classId = this.value;
  },
  watch: {
    gradeId() {
      if (this.gradeId) {
        this.getClassList()
      }
    },
    professionId() {
      if (this.professionId) {
        this.getClassList()
      }
    },
    classId (newVal, oldVal) {
      if (this.classId) {
        this.$emit("changeVal", newVal);
      }
    },
    value(newVal) {
      this.classId = newVal;
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
