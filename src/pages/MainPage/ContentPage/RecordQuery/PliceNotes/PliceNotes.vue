<template>
  <div class="PliceNotes">
    <Title title="报警管理" />
    <RouterTap :menuArr="menuArr" pathRouter="PliceNotes" />
  </div>
</template>

<script>
import ErrorList from "./components/ErrorList"; // 未归
import NotesDetails from "./components/NotesDetails"; // 未归
import lateNotesDetails from "./components/lateNotesDetails"; // 晚归
import NoDetails from "./components/NoDetails"; // 无记录
import inOutDetails from "./components/inOutDetails"; // 进出
import SurmountDetails from "./components/SurmountDetails"; // 翻越
import TrailingDetails from "./components/TrailingDetails"; // 尾随
import blackDetails from "./components/blackDetails"; // 黑名单
import VisitorDetails from "./components/VisitorDetails"; // 访客超时
import abnormalDetails from "./components/abnormalDetails"; // 设备异常

export default {
  name: "PliceNotes",
  data() {
    return {
      menuArr: [
        {
          name: "未归",
          component: NotesDetails
        },
        {
          name: "晚归",
          component: lateNotesDetails
        },
        {
          name: "无记录",
          component: NoDetails
        },
        {
          name: "代刷",
          component: inOutDetails
        },
        {
          name: "非法通行",
          component: ErrorList
        },
        // {
        //   name: "翻越",
        //   component: SurmountDetails
        // },
        // {
        //   name: "尾随",
        //   component: TrailingDetails
        // },
        {
          name: "黑名单",
          component: blackDetails
        },
        {
          name: "访客超时",
          component: VisitorDetails
        },
        {
          name: "设备异常",
          component: abnormalDetails
        }
      ]
    };
  },

  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style scoped lang="less">
@import "~@/global";
</style>
