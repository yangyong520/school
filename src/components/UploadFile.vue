<template>
  <div class="ant-upload-customer">
    <a-spin :spinning="spinning">
      <a-upload
        :name="name"
        ref="uploadFile"
        :action="`${baseUrl}` + action"
        :accept="accept"
        :beforeUpload="beforeUpload"
        :showUploadList="showUploadList"
        @change="uploadFileChange">
        <slot></slot>
      </a-upload>
    </a-spin>
  </div>
</template>

<script>
import { baseUrl } from '@/baseUrl'

export default {
  name: 'file-upload',
  props: {
    // 上传格式
    accept: {
      type: String,
      default: '.jpg, .png, .jpeg'
    },
    // 上传地址
    action: String,
    // 上传name
    name: {
      type: String,
      default: 'file'
    },
    // 显示上传列表
    showUploadList: {
      type: Boolean,
      default: false
    },
    // 上传大小
    size: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      baseUrl,
      spinning: false
    }
  },
  methods: {
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < this.size
      if (!isLt2M) {
        this.$message.error(`上传文件不能超过!${this.size}M!`)
      }
      return isLt2M
    },
    uploadFileChange (info) {
      this.spinning = true
      const status = info.file.status
      if (status === 'done') {
        this.uploadSuccess(info)
        return
      }
      if (status === 'uploading') {
        this.uploadLoading(info)
        return
      }
      if (status === 'error') {
        this.uploadFileErr(info)
        return
      }
    },
    // 上传成功
    uploadSuccess (info) {
      this.spinning = false
      if (info.file.response.code === 500) {
        this.$message.warning(info.file.response.msg)
        return
      }
      this.$message.success(info.file.response.msg)
      this.$emit('changeFile', info.file)
    },
    // 上传失败
    uploadFileErr (info) {
      this.spinning = false
      this.$message.error('上传失败！')
    },
    // 上传中
    uploadLoading (info) {
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

.ant-upload-customer {
  width: 100%;
  height: 100%;
}
</style>
