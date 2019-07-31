<template>
  <a-select
    v-model="classId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    placeholder="请选择班级"
    class="input-select"
    :style="{width}"
    :disabled="disabled"
    mode="multiple"
    :maxTagCount="1"
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
import { multipleSelect } from "./multipleSelectMixin";
const { queryClassByProfessionAndGradeButch } = req;
export default {
  name: "ClassSelectMultiple",
  mixins: [multipleSelect],
  props: {
    value: {
      type: Array
    },
    professionId: {
      type: Array
    },
    size: {
      type: String,
      default: "small"
    },
    gradeId: {
      type: Array
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
      classId: [],
      classesList: []
    };
  },
  methods: {
    getClassList() {
      const { gradeId, professionId } = this;
      this.classId = ["all"];
      if (this.haveAll) {
        this.classId = ["all"];
      }
      queryClassByProfessionAndGradeButch({
        proIds: professionId.some(ele => ele === "all") ? [-1] : professionId,
        gradeIds: gradeId.some(ele => ele === "all") ? [-1] : gradeId
      }).then(
        ({ data: { code, msg, data = [] } }) => {
          if (code === 0) {
            this.classesList = data;
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    watchSelectBtn(newVal, listArr, setStr) {
      if (
        newVal.length === 0 ||
        (listArr.length === newVal.length &&
          newVal.every(ele => ele !== "all")) ||
        (newVal.length > 1 && newVal[newVal.length - 1] === "all")
      ) {
        this[setStr] = ["all"];
        return;
      } else if (newVal.length > 1 && newVal.some(ele => ele === "all")) {
        this[setStr] = newVal.filter(ele => ele !== "all");
        return;
      }
      if (newVal.length === 0) {
        return;
      }
      this.$emit("changeVal", newVal);
    }
  },
  created() {
    this.getClassList();
    this.classId = this.value;
  },
  watch: {
    gradeId: {
      handler() {
        this.getClassList();
      },
      deep: true
    },
    professionId: {
      handler() {
        this.getClassList();
      },
      deep: true
    },
    classId(newVal, oldVal) {
      const { classesList } = this;
      this.watchSelectBtn(newVal, classesList, "classId");
      // if (
      //   newVal.length === 0 ||
      //   (this.classesList.length === this.classId.length &&
      //     this.classId.every(ele => ele !== "all"))
      // ) {
      //   this.classId = ["all"];
      // } else if (newVal.length > 1 && newVal.some(ele => ele === "all")) {
      //   this.classId = newVal.filter(ele => ele !== "all");
      // }
      // this.$emit("changeVal", newVal);
    },
    value(newVal) {
      this.classId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
