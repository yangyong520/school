<template>
  <div>
    <Title title="人脸检索库"/>
    <div style="padding: 20px;background: #fff;margin-top: 20px;">
      <div class="layout-flex">
        <div class="upload-img">
          <img :src="imageShow" alt>
          <upload-com @uploadCom="uploadCom" :disabled="true" name="image">
            <div v-if="!imageShow" class="uplod-btn">+</div>
          </upload-com>
        </div>
        <div>
          <a-input placeholder="请输入阈值（0~1）" v-model="form.num" style="width: 150px;"/>
          <a-select v-model="form.sex" style="width: 150px">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
          <a-button type="primary" @click="submit">查询</a-button>
        </div>
      </div>
      <div class="per-list">
        <div class="per-item" v-for="item in list" :key="item.id" @click="eyeDetail(item.personId, item.type)">
          <div class="imgage">
            <img :src="item.userPicth" alt="">
          </div>
          <div class="text">相似度: {{item.similarity}}%</div>
        </div>
        <div v-if="list.length === 0" style="text-align: center;width: 100%">暂无数据</div>
      </div>
    </div>
    <a-modal
      title="人员信息详情"
      :visible="showModal"
      :maskClosable="false"
      @ok="ok"
      @cancel="cancel">
      <div class="modal-box">
        <div class="modal-top" v-if="detail.user">
          <div class="layout-flex">
            <div class="per-image">
              <img :src="detail.user.userPicth" alt="">
            </div>
            <div class="per-info">
              <div>
                <label>人员类型:</label>
                <span>{{showText(detail.user.type)}}</span>
              </div>
              <div class="layout-flex space" style="justify-content: space-between;">
                <div>
                  <label>姓名:</label>
                  <span>{{detail.user.name}}</span>
                </div>
                <div>
                  <label>性别:</label>
                  <span>{{detail.user.sex}}</span>
                </div>
              </div>
              <div>
                <label>学号:</label>
                <span>{{detail.user.userNum}}</span>
              </div>
              <div>
                <label>电话号码:</label>
                <span>{{detail.user.phone}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-bottom">
          <a-table
            :columns="columns"
            :showHeader="false"
            rowKey="id"
            :dataSource="detail.inOutForms"
            :pagination="false">
          </a-table>
          <!-- <div class="pagination-page-box">
            <a-pagination
              class="pagination-page"
              size="small"
              :current="pageinfo.pageNum"
              :total="pageinfo.totalElements"
              showSizeChanger
              showQuickJumper
              :pageSize="pageinfo.pageSize"
              @change="changePage"
              @showSizeChange="changeSize"
            />
          </div> -->
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { test, IntegerTest } from "@/unit/formTest"
import req from "@/req/req"

const {
  faceSearch,
  getFaceDetail,
} = req;
export default {
  name: 'Face-Retrieval',
  data () {
    return {
      imageShow: '',
      img: '',
      form: {
        num: '',
        sex: 'all'
      },
      list: [],
      showModal: false,
      detail: {},
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      columns: [
        {
          title: "房间号",
          customRender: (text, row, index) => {
            const areaName = row.areaName + '-'
            const buildName = row.buildName
            return (areaName + buildName) || '无'
          }
        },
        {
          title: "房间号",
          customRender: (text, row, index) => {
            if (row.inOut === 0) {
              return '进'
            } else {
              return '出'
            }
          }
        },
        {
          title: "房间号",
          dataIndex: "modifyTime",
        },
      ]
    }
  },
  methods: {
    showText (type) {
      if (type) {
        let text = {
          0: '超级管理员',
          1: '学生',
          2: '辅导员',
          3: '系统管理员',
          4: '宿管',
          5: '院系管理员',
          6: '家长',
          7: '其他',
          8: '家长'
        }[type]
        return text
      }
    },
    cancel () {
      this.showModal = false
    },
    ok () {
      this.showModal = false
    },
    uploadCom (file, name) {
      this[name] = file
      const reader = new FileReader()
      reader.onload = event => {
        this[name + 'Show'] = event.target.result
      }
      reader.readAsDataURL(file)
    },
    submit () {
      if (!this.image) {
        this.$message.warning('请上传图片！')
        return
      }
      if (!this.form.num) {
        this.$message.warning('请输入阈值！')
        return
      }
      var re = /^[0-9]+.?[0-9]*/
      if (!re.test(this.form.num)) {
        this.$message.warning('请输入正数!')
        return
      }
      if (parseFloat(this.form.num) > 1) {
        this.$message.warning('输入数字不能超过1!')
        return
      }
      if (this.form.num.length > 4) {
        this.$message.warning('输入数字不能超过2位小数!')
        return
      }
      faceSearch({
        userPicth: this.image,
        detection: this.form.num,
        sex: this.form.sex === 'all' ? '' : this.form.sex
      }).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          this.list = data ? data : []
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getDetail();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getDetail();
    },
    eyeDetail (id, type) {
      this.linkId = id
      this.linkType = type
      this.getDetail()
      this.showModal = true
    },
    getDetail () {
      getFaceDetail(
        {
          pageSize: this.pageinfo.pageSize,
          pageNum: this.pageinfo.pageNum,
          id: this.linkId,
          type: this.linkType
        }
      ).then(({data: {msg, data, code}}) => {
        if (code === 0) {
          this.detail = data
        } else {
          this.$message.warning(msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/global';

.layout-flex {
  display: flex;
  align-items: flex-end;
}
.upload-img {
  position: relative;
  width: 130px;
  height: 150px;
  border-radius: 3px;
  background: #eee;
  margin-right: 20px;
  cursor: pointer;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .uplod-btn {
    height: 100%;
    line-height: 150px;
    width: 100%;
    text-align: center;
  }
}
.per-list {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  .per-item {
    width: 8%;
    cursor: pointer;
    height: 170px;
    text-align: center;
    border: 1px solid #eee;
    margin: 10px 2% 0 0;
    border-radius: 4px;
    .imgage {
      width: 100%;
      border-radius: 4px;
      height: 140px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      // background: #999;
    }
  }
  .text {
    line-height: 30px
  }
}
.modal-box {
  position: relative;
  .modal-top {
    .per-image {
      width: 35%;
      margin-right: 5%;
      img {
        width: 100%;
        height: 100px;
        object-fit: cover;
      }
    }
    .per-info {
      line-height: 2;
      width: 60%
    }
  }
  .modal-bottom {
    margin: 20px 0;
  }
}
.space {
  div {
    line-height: 2;
  }
}
.remask-text {
  z-index: -1;
  font-size: 12px;
  color: #999;
  position: absolute;
  top: 0;
  left: 10px;
  line-height: 32px;
  height: 100%;
}
</style>
