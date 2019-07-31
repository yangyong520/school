<template>
  <a-select
    v-model="professionId"
    :dropdownStyle="{zIndex: 10002}"
    :size="size"
    @change="change"
    :dropdownMatchSelectWidth="false"
    :style="{width}"
    placeholder="请选择专业"
    :disabled="disabled"
    mode="multiple"
    :maxTagCount="1"
  >
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
const { queryProfessionByCollege } = req;
import { multipleSelect } from "./multipleSelectMixin";
export default {
  name: "ProfessionSelect",
  mixins: [multipleSelect],
  props: {
    value: {
      type: Array
    },
    collegeId: {
      type: Array
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
    }
  },
  data() {
    return {
      professionArrList: [],
      professionId: []
    };
  },
  methods: {
    getProfessionArrList() {
      const { collegeId } = this;
      this.professionId = [];
      if (this.haveAll) {
        this.professionId = ["all"];
      }
      if (!collegeId) {
        return;
      }
      queryProfessionByCollege(
        collegeId.some(ele => ele === "all") ? [-1] : collegeId
      ).then(
        ({ data: { code, msg, data = [] } }) => {
          if (code === 0) {
            this.professionArrList = data;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    change (value, option) {
      if (value.length < 1) {
        this.professionId = []
        return
      }
      if (value[0] === 'all') {
        if (value.length < 2) {
          this.professionId = value
          return
        } else {
          this.professionId = [value[1]]
          return
        }
      }
      if (value[0] !== 'all' && value.some(ele => ele === 'all')) {
        this.professionId = ['all']
      }
    }
  },
  created() {
    this.getProfessionArrList();
    this.professionId = this.value;
  },
  watch: {
    collegeId: {
      handler() {
        this.getProfessionArrList();
      },
      deep: true
    },
    professionId () {
      this.$emit("changeVal", this.professionId);
    },
    value(newVal) {
      this.professionId = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
