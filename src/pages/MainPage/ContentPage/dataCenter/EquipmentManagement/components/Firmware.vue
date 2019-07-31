<template>
  <div class="Firmware">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleAdd = !visibleAdd"
            v-if="roleDataObj.isUpload"
          >上传</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="版本号"
            v-model="versionSearch"
            @search="getFileList"
            enterButton
          />
        </div>
      </div>
    </div>
    <a-table
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="fileArrLsit"
      :pagination="false"
      @change="changePage"
      rowKey="id"
    />
    <!--添加-->
    <a-modal
      :maskClosable="false"
      title="新增"
      v-model="visibleAdd"
      @ok="handleOkAdd"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span class="boxSpanInput" style="width: 45px; text-align: left;">选择文件:</span>
        <upload-com @uploadCom="uploadCom" name="firmware" accept=".app">
          <a-button style="marginLeft: 11px;">
            <a-icon type="upload"/>
            {{fileName ? fileName : "上传文件"}}
          </a-button>
        </upload-com>
        <span>{{fileSize}}{{fileSize ? 'M' : ''}}</span>
      </div>
      <div class="input-box">
        <span class="boxSpanInput">版本号:</span>
        <a-input style="marginLeft: 11px;" placeholder="请输入版本号" v-model="version"></a-input>
      </div>
      <div class="input-box">
        <span class="boxSpanInput">更新说明:</span>
        <a-textarea
          class="input-box-item"
          v-model="mark"
          style="marginLeft: 11px;"
          placeholder="请输入更新说明"
          :rows="8"
        />
      </div>
    </a-modal>
    <!--添加-->
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :total="10"
        showSizeChanger
        showQuickJumper
        @change="changePage"
        :itemRender="itemRender"
      />
    </div>
    <!-- 推送 -->
    <a-modal
      :maskClosable="false"
      title="推送"
      v-model="visibleModal"
      @ok="handleOkSend"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <!-- 1:宿舍门禁 2：访客登记 3：大屏 -->
        <span>推送目标:</span>
        <a-select v-model="type" class="input-select" @change="getRedEyeArea">
          <a-select-option :value="0">宿舍门禁</a-select-option>
          <a-select-option :value="1">访客登记</a-select-option>
          <a-select-option :value="2">大屏</a-select-option>
        </a-select>
      </div>
      <div class="input-box" v-if="plainOptions.length == 0" style="justify-content: center;">
        <!-- <span>推送目标:</span> -->
            暂无数据
      </div>
      <div  v-if="plainOptions.length > 0">
        <div class="input-box">
          <!-- <span>推送目标:</span> -->
          <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">全选</a-checkbox>
          <br>
        </div>
        <div class="input-box">
          <a-checkbox-group
            @change="onChangeCheck"
            v-model="checkedList"
            style="height: 200px;width: 100%;overflow-y: scroll;overflow-x: hidden;">
            <a-row :gutter="24" :key="index" v-for="(item, index) in plainOptions">
              <a-col :span="24">
                <a-checkbox :value="item.id" :checked="item.checked">{{item.areaName}}-{{item.buildName}}-{{item.door}}号门-{{item.passway}}通道</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
const {
  insertMachineUpdateVo,
  queryUpdateMachineList,
  deleteMachineUpdateButch,
  queryRedEyeArea,
  pushMachineUpdate
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "Firmware",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "固件更新",

      visible: false, // 弹窗
      msg: "Welcome to Your Vue.js App",
      visibleModal: false,
      columns: [
        {
          title: "版本",
          dataIndex: "version"
        },
        {
          title: "文件大小",
          dataIndex: "fileSize"
        },
        {
          title: "更新说明",
          dataIndex: "remark"
        },
        {
          title: "操作",
          dataIndex: "password",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {record.status === 0 && this.roleDataObj.isPush ? (
                  <span
                    onClick={() => {
                      this.sendId = record.id;
                      this.getRedEyeArea();
                      this.visibleModal = !this.visibleModal;
                    }}
                  >
                    推送
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
                {this.roleDataObj.isDel ? (
                  <span
                    onClick={() => {
                      this.delOne(record.id);
                    }}
                  >
                    删除
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          }
        }
      ],
      selectedRowKeys: [],
      checkedList: [],
      plainOptions: [],
      fileUpload: null,
      mark: null,
      fileSize: "",
      fileName: "",
      visibleAdd: false, // 弹窗
      version: "",
      fileArrLsit: [],
      sendId: "",
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      versionSearch: "",
      type: 1,
      checkAll: false,
    };
  },
  computed: {
    indeterminate() {
      const { checkedList, plainOptions } = this;
      if (
        checkedList.length === plainOptions.length ||
        checkedList.length === 0
      ) {
        return false;
      } else if (
        checkedList.length < plainOptions.length && 0 < checkedList.length
      ) {
        return true;
      }
    },
    // checkAll() {
    //   const { checkedList, plainOptions } = this;
    //   return checkedList.length === plainOptions.length;
    // }
  },
  methods: {
    uploadCom(file, name) {
      // 获取文件
      this.fileSize = (file.size / 1024 / 1024).toFixed(2);
      this.fileName = file.name;
      this.fileUpload = file;
    },
    handleOkAdd() {
      const {
        fileUpload,
        mark,
        fileSize,
        version,
        $message,
        getFileList
      } = this;
      if (!fileUpload) {
        $message.warning("请先选择文件！");
        return;
      }
      if (!version || !fileSize || !mark || !fileUpload) {
        $message.warning("请完善文件描述信息！");
        return;
      }
      insertMachineUpdateVo({
        file: fileUpload,
        mark,
        fileSize,
        version
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.fileName = "";
          this.fileSize = "";
          this.mark = "";
          this.version = "";
          this.visibleAdd = false;
          $message.success(msg);
          getFileList();
        } else {
          $message.warning(msg);
        }
      });
    },
    handleOkSend() {
      const { type, sendId, checkedList, $message, getFileList } = this;
      if(checkedList.length == 0){
        $message.warning("请选择推送区域！");
        return ;
      }
      pushMachineUpdate({
        id: sendId, // 可选	String	推送的主键
        type, // 可选	Integer	1:宿舍门禁
        areaFormList: checkedList // 可选	List<AreaForm>	选择的区域
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.visibleModal = false;
          getFileList();
          $message.success(msg);
        } else {
          $message.warning(msg);
        }
      });
    },
    getFileList() {
      const { versionSearch } = this;
      queryUpdateMachineList({ version: versionSearch }).then(
        ({
          data: {
            code,
            data: { content, pageinfo },
            msg
          }
        }) => {
          this.fileArrLsit = content;
        }
      );
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message, getFileList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteMachineUpdateButch([id]).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getFileList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    dleList() {
      const { selectedRowKeys, $message, $confirm, getFileList } = this;
      if (selectedRowKeys.length === 0) {
        $message.warning("请先选择目标！");
        return;
      }
      $confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          let ids = "";
          deleteMachineUpdateButch(selectedRowKeys).then(
            ({ data: { code, msg } }) => {
              if (code === 0) {
                this.selectedRowKeys = []
                $message.success(msg);
                this.pageinfo.pageNum = 1;
                getFileList();
              } else {
                $message.error(msg);
              }
            }
          );
        },
        onCancel() {}
      });
    },
    getRedEyeArea() {
      const { $message, type } = this;
      queryRedEyeArea({
        type
      }).then(({ data: { code, data = [], msg } }) => {
        if (code === 0) {
          this.plainOptions = data.map(x => {
            return {...x, checked: false}
          })
        } else {
          $message.success(msg);
        }
      });
    },

    onChangeCheck (checkedList) {
      this.checkAll = this.checkedList.length === this.plainOptions.length
    },
    onCheckAllChange (e) {
      this.checkedList = e.target.checked ? this.plainOptions.map(x => x.id) : []
      this.checkAll = e.target.checked
    },
    changePage(num) {
    },
    itemRender(current, type, originalElement) {
      return originalElement;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 添加
    showModal() {
      this.visible = true;
    },
    // 添加
    // 单项删除
    del() {
      this.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {},
        onCancel() {}
      });
    }
  },
  created() {
    this.getFileList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
