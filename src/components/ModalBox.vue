<template>
  <a-modal :maskClosable="false" title="添加" v-model="visible" @ok="handleOk" okText="确定">
    999
  </a-modal>
</template>

<script>
export default {
  name: "add-modal",
  props: {
    visibleContry: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleOk() {
      this.$emit("okForm", this);
    },
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
