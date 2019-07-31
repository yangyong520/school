<template>
  <div class="dormitory">
    <Title title="宿舍管理"/>
    <RouterTap :menuArr="menuArr" pathRouter="dormitory"/>
  </div>
</template>

<script>
import dormitoryRegion from "./components/dormitoryRegion"; // 区域
import dormitoryBan from "./components/dormitoryBan"; // 楼栋管理
import dormitoryRoom from "./components/dormitoryRoom"; // 房间管理
import dormitoryBed from "./components/dormitoryBed"; // 床位管理
export default {
  name: "dormitory",
  data() {
    return {
      menuArr: [
        {
          name: "区域管理",
          component: dormitoryRegion
        },
        {
          name: "楼栋管理",
          component: dormitoryBan
        },
        {
          name: "房间管理",
          component: dormitoryRoom
        },
        {
          name: "床位管理",
          component: dormitoryBed
        }
      ]
    };
  },
  components: {
    dormitoryRegion, // 区域
    dormitoryBan, // 楼栋管理
    dormitoryRoom, // 房间管理
    dormitoryBed // 床位管理
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
