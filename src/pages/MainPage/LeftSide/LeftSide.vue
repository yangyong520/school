<template>
  <a-layout-sider :trigger="null" collapsible v-model="collapsed" class="leftside-page-sider">
    <div class="logo" :style="{ backgroundImage: './static/Bitmap.png'}">
      <img :src="'./static/Bitmap.png'" alt>
    </div>
    <a-menu
      theme="dark"
      mode="inline"
      :defaultSelectedKeys="selectIng"
      v-model="selectIng"
      :openKeys="openKeys"
      @openChange="handleOpenChange"
      @click="handleClickChange">
      <template v-for="item in leftSideArr">
        <a-menu-item v-if="!item.children" :key="item.keyName">
          <!-- <a-icon :type="item.icon"/> -->
          <icon-font type="iconshouye"/>
          <span>{{item.name}}</span>
        </a-menu-item>
        <a-sub-menu :key="item.keyName" v-else>
          <span slot="title">
            <!-- <a-icon :type="item.icon"/> -->
            <icon-font :type="item.icon"/>
            <span>{{item.name}}</span>
          </span>
          <a-menu-item v-for="ite in item.children" :key="ite.keyName">{{ite.name}}</a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import req from "@/req/req";
const { getCountNum } = req;
export default {
  name: "LeftSide",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectIng: ["Institute"],
      openKeys: ["sub1"],
      countNum: 0
    };
  },
  computed: {
    ...mapState(["leftSideArr"])
  },
  created() {
    this.setRouter(this.$route.name);
  },
  methods: {
    getCountNum () {
      getCountNum().then(({data: {data, code, msg}}) => {
        this.countNum = 0
        this.$emit('changeNum', this.countNum)
      })
    },
    handleClickChange({ item, key, keyPath }) {
      let name = "";
      for (let item of this.leftSideArr) {
        if (item.children) {
          for (let ite of item.children) {
            if (ite.keyName === key) {
              name = ite.name;
            }
          }
        } else {
          if (item.keyName === key) {
            name = item.name;
          }
        }
      }
      this.$emit("pushRouterObj", { keyName: key, name });
      this.$router.push({ name: key, params: { id: 0 } });
    },
    handleOpenChange(openKeys) {
      this.openKeys = openKeys;
    },
    setRouter(name) {
      for (let item of this.leftSideArr) {
        if (item.children) {
          for (let ite of item.children) {
            if (ite.keyName === name) {
              this.openKeys = [item.keyName];
              this.selectIng = [name];
              return;
            }
          }
        } else {
          if (item.keyName === name) {
            this.selectIng = [name];
            return;
          }
        }
      }
    }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.getCountNum()
        this.setRouter(newVal.name);
      },
      deep: true
    }
  }
};
</script>
<style scoped lang="less">
@import '~@/global';

.leftside-page-sider {
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  .logo {
    margin: auto;
    text-align: center;
    margin: 20px auto;
    img {
      width: 90%;
    }
  }
  // &::-webkit-scrollbar {
  //   display: none;
  // }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px #1890ff;
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #1890ff;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
