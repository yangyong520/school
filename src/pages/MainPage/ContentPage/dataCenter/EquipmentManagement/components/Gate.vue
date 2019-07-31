<template>
  <div class="Gate">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="visible = !visible">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="showConfirm">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <span>依附设备</span>
          <a-select defaultValue="全部" style="width: 120px" @change="handleChange">
            <a-select-option value="全部">全部</a-select-option>
            <a-select-option value="在线">在线</a-select-option>
            <a-select-option value="离线">离线</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <a-table
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      @change="changePage"
    />
    <!--添加-->
    <a-modal :maskClosable="false" title="新增" v-model="visible" @ok="handleOkAdd" okText="确定" class="modal-box">
      <!-- <div class="input-box">
        <span class="boxSpanInput">设备名称:</span>
        <a-input size="small" class="input-box-item boxInput" placeholder="请输入区域名"/>
      </div>-->
      <div class="input-box">
        <span class="boxSpanInput">账号:</span>
        <a-input
          size="small"
          v-model="account"
          class="input-box-item boxInput"
          placeholder="请输入区域名"
        />
      </div>
      <div class="input-box">
        <span class="boxSpanInput">密码:</span>
        <a-input
          size="small"
          v-model="password"
          class="input-box-item boxInput"
          placeholder="请输入区域名"
          type="password"
        />
      </div>
      <div class="input-box">
        <span class="boxSpanInput">IP:</span>
        <a-input size="small" v-model="ip" class="input-box-item boxInput" placeholder="请输入区域名"/>
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
  </div>
</template>

<script>
import req from "@/req/req";
const { insertGateMachine } = req;
const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    name: "设备" + 1,
    gateSet: "12",
    IP: "192.168.1.2"
  });
}
export default {
  name: "Gate",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      data,
      columns: [
        {
          title: "设备名称",
          dataIndex: "name"
        },
        {
          title: "依附设备",
          dataIndex: "gateSet"
        },
        {
          title: "IP",
          dataIndex: "IP"
        },
        {
          title: "操作",
          dataIndex: "password",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                <span
                  onClick={() => {
                    this.visible = !this.visible;
                  }}
                >
                  编辑
                </span>
                <span
                  onClick={() => {
                    this.del();
                  }}
                >
                  删除
                </span>
              </div>
            );
          }
        }
      ],
      selectedRowKeys: [],

      visible: false, // 添加弹窗
      account: null,
      password: null,
      ip: null,
    };
  },
  methods: {
    handleChange(event) {
    },
    changePage(num) {
    },
    itemRender(current, type, originalElement) {
      return originalElement;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 删除
    showConfirm() {
      this.$confirm({
        title: "删除",
        content: "是否确认进行批量删除？",
        onOk: () => {},
        onCancel: () => {}
      });
    },
    // 添加
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    // 添加
    // 单项删除
    del() {
      this.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {},
        onCancel: () => {}
      });
    },

    handleOkAdd() {
      const { account, password, ip } = this;
      insertGateMachine({
        account,
        password,
        ip
      }).then(({ data: { code, msg } }) => {
        this.visible = false;
        if (code === 0) {
          this.$message.success(msg);
          this.visibleBed = false;
          // this.getBedList()
        } else {
          this.$message.warning(msg);
        }
      });
    },
    getGateList(){

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.inner-style {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
}
</style>
