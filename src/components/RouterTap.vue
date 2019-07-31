<template>
  <div class="RouterTap">
    <a-menu
      v-model="current"
      mode="horizontal"
      :style="{backgroundColor: 'transparent'}"
      v-if="showMenu">
      <a-menu-item
        v-for="(item,index) in roleCon"
        :key="index"
        @click="menuCont(index)">{{item.name}}</a-menu-item>
    </a-menu>
    <template v-for="(item, index) in roleCon">
      <component v-if="current[0] === index" :key="index" :is="roleCon[index].component"></component>
    </template>
    <div v-if="roleCon.length === 0" :style="{margin: '10px'}">无权限</div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Vue from "vue";
export default {
  name: "RouterTap",
  props: {
    menuArr: {
      type: Array,
      default: []
    },
    pathRouter: {
      type: String,
      required: true
    },
    showMenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      current: [0],
      roleCon: [],
      loging: false
    };
  },
  computed: {
    ...mapState(["havRoleList"])
  },
  methods: {
    menuCont(id) {
      this.$router.push({ name: this.pathRouter, params: { id } });
      // this.setTapData({ keyName: this.pathRouter, id });
    },
    showTap() {
      const { havRoleList, menuArr } = this;
      this.roleCon = [...menuArr];
      // 如果是超级管理员不就行权限控制
      const data = Vue.ls.get("USER_DATA");
      if (data.type === 0) {
        console.log("如果是超级管理员就不进行权限控制");
      } else {
        this.roleCon = [...menuArr].filter(ele => {
          return havRoleList.some(eleRole => eleRole.moduleName === ele.name);
        });
      }
      this.current = [Number(this.$route.params.id)];
      // this.setTapData({ keyName: this.pathRouter, id: this.$route.params.id });
    },
    ...mapMutations(["setTapData"])
  },
  created() {
    this.showTap();
  },
  watch: {
    "$route.params.id": {
      handler(newVal) {
        this.current = [Number(newVal)];
      }
    },
    havRoleList() {
      this.showTap();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
