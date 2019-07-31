<template>
  <div class="manageClass">
    <Title title="班级管理"/>
    <RouterTap :menuArr="menuArr" pathRouter="manageClass"/>
  </div>
</template>

<script>
import manageCollege from "./manageCollege"; // 学院管理
import manageMajor from "./manageMajor"; // 专业管理
import manageGrade from "./manageGrade"; // 年级管理
import manageClasses from "./manageClasses"; // 班级管理
export default {
  name: "manageClass",
  data() {
    return {
      menuArr: [
        {
          name: "学院管理",
          component: manageCollege
        },
        {
          name: "专业管理",
          component: manageMajor
        },
        {
          name: "年级管理",
          component: manageGrade
        },
        {
          name: "班级管理",
          component: manageClasses
        }
      ]
    };
  },

  mounted() {},
  methods: {}
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
