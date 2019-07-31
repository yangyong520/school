<template>
  <a-modal :maskClosable="false" title="添加" class="widthRole" v-model="visible" @ok="handleOk" okText="确定">
    <a-spin :spinning="spinning">
      <p>角色权限</p>
      <template v-for="(item,index) in moduleList">
        <RoleItem :itemObj="item" :key="index" :deep="0"/>
      </template>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: "RoleAuthority",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
    moduleList: {
      type: Array,
      default: [
        {
          moduleName: ""
        }
      ]
    },
    spinning: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,

      checkBox: []
    };
  },
  methods: {
    handleOk() {
      this.$emit("okForm", this);
    },
    onChange(checkedValues) {
    },
    onChangeGroup(checkedValues) {
    }
  },
  created() {
    this.visible = this.visibleContry;
  },
  watch: {
    visible(newVal) {
      this.$emit("cgModal", newVal);
    },
    visibleContry(newVal) {
      this.visible = newVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
