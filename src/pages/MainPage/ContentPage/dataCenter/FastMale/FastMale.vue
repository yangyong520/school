<template>
  <div class="FastMale">
    <Title title="快递站点"/>
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="visibleBan = !visibleBan" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="maleListData"
        :pagination="false"
        rowKey="id"
      />
    </a-spin>
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :total="pageinfo.totalElements"
        :current="pageinfo.pageNum"
        showSizeChanger
        showQuickJumper
        :pageSize="pageinfo.pageSize"
        @change="changePage"
        @showSizeChange="changeSize"
      />
    </div>
    <!--添加-->
    <a-modal
      title="新增"
      :maskClosable="false"
      v-model="visibleBan"
      @ok="addHandleOkBen"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box">
        <span class="boxBanModalSpan">站点名称:</span>
        <a-input v-model="siteName" class="input-box-item boxBanModalInput" placeholder="请输入站点名称"/>
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan">所在位置:</span>
        <a-input v-model="address" class="input-box-item boxBanModalInput" placeholder="请输入所在位置"/>
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan">联系方式:</span>
        <a-input v-model="phone" class="input-box-item boxBanModalInput" placeholder="请输入联系方式"/>
      </div>
    </a-modal>
    <!--编辑-->
    <a-modal
      title="编辑"
      :maskClosable="false"
      v-model="visibleBanUpdata"
      @ok="upDataMale"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box">
        <span class="boxBanModalSpan">站点名称:</span>
        <a-input
          v-model="siteNameUpdata"
          class="input-box-item boxBanModalInput"
          placeholder="请输入站点名称"
        />
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan">所在位置:</span>
        <a-input
          v-model="addressUpdata"
          class="input-box-item boxBanModalInput"
          placeholder="请输入所在位置"
        />
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan">联系方式:</span>
        <a-input
          v-model="phoneUpdata"
          class="input-box-item boxBanModalInput"
          placeholder="请输入联系方式"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import { test, PhoneTest } from "@/unit/formTest";
const {
  deleteButchDelivery,
  deleteDeliveryByPrimaryKey,
  queryDeliveryList,
  insertDelivery,
  updateDeliveryByPrimaryKey
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "FastMale",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "快递站点",

      columns: [
        {
          title: "站点名称",
          dataIndex: "siteName"
        },
        {
          title: "站点位置",
          dataIndex: "address"
        },
        {
          title: "联系方式",
          dataIndex: "phone"
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.siteNameUpdata = record.siteName;
                      this.addressUpdata = record.address;
                      this.phoneUpdata = record.phone;
                      this.idUpdata = record.id;
                      this.visibleBanUpdata = !this.visibleBanUpdata;
                    }}
                  >
                    编辑
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
      visibleBan: false,
      visibleBanUpdata: false,
      siteName: null,
      address: null,
      phone: null,
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      maleListData: [],
      spinning: false,
      selectedRowKeys: [],
      searchStation: null,
      siteNameUpdata: null,
      addressUpdata: null,
      phoneUpdata: null,
      idUpdata: null
    };
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    addHandleOkBen() {
      const { siteName, address, phone, $message } = this;
      const testObj = test(PhoneTest(phone));
      if (!siteName) {
        $message.warning("请输入站点名称！");
        return;
      }
      if (!address) {
        $message.warning("请输入所在位置！");
        return;
      }
      if (!phone) {
        $message.warning("请输入联系方式！");
        return;
      }
      if (!testObj.status) {
        $message.warning(testObj.msg);
        return;
      }
      insertDelivery({
        siteName,
        address,
        phone
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getMaleList();
          this.siteName = "";
          this.address = "";
          this.phone = "";
          this.visibleBan = false;
        } else {
          $message.warning(msg);
        }
      });
    },
    getMaleList() {
      const {
        pageinfo: { pageSize, pageNum },
        searchStation
      } = this;
      this.spinning = true;
      queryDeliveryList({
        pageSize,
        pageNum
        // siteName: searchStation
      }).then(({ data: { code, msg, data: { content = [], pageinfo } } }) => {
        if (code === 0) {
          this.maleListData = content;
          this.pageinfo = pageinfo;
          if (this.maleListData.length === 0) {
            // $message.warning('未找到楼栋数据')
          }
        } else {
          $message.warning(msg);
        }
        this.spinning = false;
      });
    },
    dleList() {
      const { selectedRowKeys, $message, $confirm } = this;
      if (selectedRowKeys.length === 0) {
        $message.warning("请先选择目标！");
        return;
      }
      $confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          let ids = "";
          selectedRowKeys.forEach((ele, index) => {
            if (index === selectedRowKeys.length - 1) {
              ids += ele;
            } else {
              ids += ele + ",";
            }
          });
          deleteButchDelivery({ ids }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.pageinfo.pageNum = 1;
              this.getMaleList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message } = this;
      $confirm({
        title: "提示",
        content: "删除后信息不可恢复,是否删除？",
        onOk: () => {
          deleteDeliveryByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              this.getMaleList();
            } else {
              $message.warning(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getMaleList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getMaleList();
    },
    upDataMale() {
      const {
        siteNameUpdata,
        addressUpdata,
        phoneUpdata,
        idUpdata,
        $message
      } = this;
      if (!siteNameUpdata) {
        $message.warning("请输入站点名称！");
        return;
      }
      if (!addressUpdata) {
        $message.warning("请输入所在位置！");
        return;
      }
      if (!phoneUpdata) {
        $message.warning("请输入联系方式！");
        return;
      }
      const testObj = test(PhoneTest(phoneUpdata));
      if (!testObj.status) {
        $message.warning(testObj.msg);
        return;
      }
      updateDeliveryByPrimaryKey({
        siteName: siteNameUpdata,
        address: addressUpdata,
        phone: phoneUpdata,
        id: idUpdata
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getMaleList();
          this.visibleBanUpdata = false;
        } else {
          $message.warning(msg);
        }
      });
    }
  },
  created() {
    this.getMaleList();
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
