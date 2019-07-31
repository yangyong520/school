<template>
  <a-checkbox @change="onChange">{{check}}</a-checkbox>
</template>
<script>
export default {
  name: "checkBox",
  props: {
    statusObj: {
      type: Number,
      default: 1
    }
  },
  data() {

  },
  computed: {},
  methods: {
    onChange(e) {
      if (e.target.checked) {
      } else {
      }
    }
  },
  created() {
    if (this.status) {
      this.check = 1
    } else {
      this.check = 0
    }
  }
};
</script>
