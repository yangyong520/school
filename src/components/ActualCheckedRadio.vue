<template>
  <div class="actual-box" :class="{'checked': checkIcon}" @click="change(fool)" :fool="fool">
    <a-icon class="inco" v-if="checkIcon" type="check" style="color: #fff; font-size: 12px" />
  </div>
</template>

<script>
export default {
  name: 'actual-checked-radio',
  props: ['fool'],
  data () {
    return {
      checkIcon: false
    }
  },
  methods: {
    change () {
      this.checkIcon = !this.checkIcon
      this.$emit('changeRadio', this.checkIcon)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

.actual-box {
  position: relative;
  margin-right: 10px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid rgb(197, 197, 197);
}
.checked {
  background: #1890ff;
  border-color: #1890ff
}
.inco {
  position: absolute;
  left: 2px;
  bottom: 2px
}
</style>
