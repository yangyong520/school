<template>
  <a-select
    v-model="gradeId"
    :dropdownStyle="{zIndex: 10002}"
    :style="{width}"
    :size="size"
    @change="change"
    class="input-select"
    placeholder="请选择年级"
    :disabled="disabled"
    mode="multiple"
    :maxTagCount="1">
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
import { multipleSelect } from "./multipleSelectMixin";
export default {
  name: "GradeSelect",
  mixins: [multipleSelect],
  props: {
    value: {
      type: Array
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
    }
  },
  data() {
    return {
      gradeArrList: [],
      gradeId: ["all"]
    };
  },
  methods: {
    getGradeList() {
      this.gradeId = ["all"];
      if (this.haveAll) {
        this.gradeId = ["all"];
      }
      selectGrade().then(
        ({ data: { code, msg, data = [] } }) => {
          if (code === 0) {
            this.gradeArrList = data;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    // watchSelectBtn(newVal, listArr, setStr) {
    //   if (
    //     newVal.length === 0 ||
    //     (listArr.length === newVal.length &&
    //       newVal.every(ele => ele !== "all")) ||
    //     (newVal.length > 1 && newVal[newVal.length - 1] === "all")
    //   ) {
    //     console.log(1)
    //     if (listArr.length === 1) {
    //       this[setStr] = [newVal[0]]
    //       return
    //     } else {
    //       this[setStr] = ["all"];
    //       return
    //     }
    //     return;
    //   } else if (newVal.length > 1 && newVal.some(ele => ele === "all")) {
    //     console.log(2)
    //     this[setStr] = newVal.filter(ele => ele !== "all");
    //     return;
    //   }
    //   if (newVal.length === 0) {
    //     return;
    //   }
    //   this.$emit("changeVal", newVal);
    // },
    change (value) {
      if (value.length < 1) {
        this.gradeId = []
        return
      }

      if (value[0] === 'all') {
        if (value.length < 2) {
          this.gradeId = value
          return
        } else {
          this.gradeId = [value[1]]
          return
        }
      }
      if (value[0] !== 'all' && value.some(ele => ele === 'all')) {
        this.gradeId = ['all']
      }
    }
  },
  created() {
    this.getGradeList(); // 获取学院列表
    this.gradeId = this.value;
  },
  watch: {
    gradeId (newVal, oldVal) {
      this.$emit("changeVal", newVal);
    },
    value(newVal) {
      this.gradeId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
