<template>
  <div class="ThredStep">
    <a-radio-group @change="onChange" size="large" v-model="value">
      <a-radio class="itemRadio" :value="1">按民族分配  （同民族学生分配到一起）</a-radio>
      <a-radio class="itemRadio" :value="2">按专业分配  （同专业学生分配到一起）</a-radio>
      <a-radio class="itemRadio" :value="3">按班级分配  （同班级学生分配到一起）</a-radio>
    </a-radio-group>
  </div>
</template>

<script>
import Vue from "vue"

export default {
  name: 'ThredStep',
  data () {
    return {
      value: 3
    }
  },
  mounted () {
    Vue.ls.set('bad_type', this.value)
  },
  methods: {
    onChange (data) {
      Vue.ls.set('bad_type', data.target.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.ThredStep{
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}
.itemRadio{
  display: block;
  height: 100px;
  line-height: 100px;
}
</style>
