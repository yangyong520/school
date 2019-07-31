<template>
  <div class="roleI-item" :class="{'roleI-item-column': itemObj.childrenList ? true : false}">
    <template v-if="itemObj.childrenList && itemObj.childrenList.length > 0">
      <a-checkbox
        class="checkbox-style"
        :style="{marginLeft: deepMargin * deep + 'px'}"
        @change="onChangeGroupModule(itemObj.childrenList)"
        :checked="getModuleChecked(itemObj.childrenList)"
        :indeterminate="getModuleChecked(itemObj.childrenList) ? false : getModuleIndeterminate(itemObj.childrenList)"
      >{{itemObj.moduleName}}</a-checkbox>
      <RoleItem
        :itemObj="item"
        :key="index"
        v-for="(item,index) in itemObj.childrenList"
        :deep="deep + 1"
      />
    </template>
    <template v-else>
      <a-checkbox
        class="checkbox-style"
        :style="{marginLeft: deepMargin * deep + 'px'}"
        @change="onChangeGroup(itemObj)"
        :indeterminate="getChecked(itemObj) ? false : getIndeterminate(itemObj)"
        :checked="getChecked(itemObj)"
      >{{ itemObj.moduleName }}</a-checkbox>
      <template v-for="(ite, inde) in itemObj">
        <a-checkbox
          class="checkbox-style"
          v-if="inde.indexOf('Str') !== -1"
          @change="onChange(itemObj, inde.replace('Str',''))"
          :disabled="checkedStatus(itemObj, inde)"
          :checked="itemObj[inde.replace('Str','')] === 0 ? false : true"
          :key="`${inde}`"
        >{{ite}}</a-checkbox>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { RoleMixin } from "./RoleMixin";
export default {
  name: "RoleItem",
  mixins: [RoleMixin],
  props: {
    itemObj: {
      type: Object,
      default: {
        moduleName: "",
        childrenList: ""
      }
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      deepMargin: 100
    };
  },
  computed: {
    ...mapState("user", ["userData"])
  },
  mounted() {
  },
  methods: {

  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.checkbox-style {
  min-width: 100px;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
