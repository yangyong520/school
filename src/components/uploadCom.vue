<template>
  <div class="uploadCom">
    <div class="box">
      <input id="labelid" type="file" ref="inputFile" @change="getFile" :accept="accept">
      <div @click="getInput" :style="{height:'100%',width:'100%'}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'uploadCom',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    limtSize: {
      type: Number,
      default: 100
    },
    name: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      dataUrl: null
    }
  },
  methods: {
    getInput () {
      this.$refs.inputFile.click()
    },
    getFile () {
      let file = this.$refs.inputFile.files[0]
      if (file) {
        let size = Math.floor(file.size / 1024 / 1024)
        if (size > this.limtSize) {
          this.$message.warning(`大小不能超过${this.limtSize}MB`)
        } else {
          this.$emit('uploadCom', file, this.name)
        }
      }
    }
  },
  created () {
    // multiple="multiple"
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.uploadCom {
  height: 100%;
  width: 100%;
}
.box {
  position: relative;
  height: 100%;
  width: 100%;
}
input {
  position: absolute;
  left: -9999px;
}
/* 使label充满整个box*/
label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10; /* 这个z-index之后说到*/
}
</style>
