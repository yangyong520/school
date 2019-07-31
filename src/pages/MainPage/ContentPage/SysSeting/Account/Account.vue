<template>
  <div class="Account">
    <Title title="账号管理"/>
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button @click="visibleAdd = !visibleAdd" v-if="roleDataObj.isAdd">添加</a-button>
        </div>
        <div class="btn-box">
          <a-button @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <span>角色:</span>
          <a-select v-model="roleIdSearch" style="width: 120px">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option :value="3">系统管理员</a-select-option>
            <a-select-option :value="5">院系管理员</a-select-option>
          </a-select>
        </div>
        <div class="btn-box">
          <a-input-search
            placeholder="账号"
            v-model="phoneSearch"
            @search="getAccountList"
            enterButton
          />
        </div>
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="sysUserList"
        :pagination="false"
        rowKey="id"
      />
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
    </a-spin>
    <!--添加-->
    <a-modal
      :maskClosable="false"
      title="新增"
      v-model="visibleAdd"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      @ok="addRole"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span class="boxSpanSelect">角色:</span>
        <a-select v-model="roleIdAdd" class="input-select">
          <a-select-option :value="3">系统管理员</a-select-option>
          <a-select-option :value="5">院系管理员</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="boxSpanSelect">帐号:</span>
        <a-input
          size="small"
          class="input-select boxInput"
          v-model="phoneAdd"
          placeholder="请输入人员手机号"
        />
      </div>
      <div class="input-box" v-if="roleIdAdd !== 3">
        <span class="boxSpanSelect">管理学院:</span>
        <college-select
          :value="collageIdList"
          size="default"
          checkboxMode="multiple"
          @changeVal="(val)=>{this.collageIdList = val}"
          class="input-select"
        />
      </div>
    </a-modal>
    <!-- 编辑 -->
    <a-modal
      :maskClosable="false"
      title="编辑"
      v-model="visibleUpdata"
      @ok="upDataRole"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span class="boxSpanSelect">角色:</span>
        <a-select v-model="upDataObj.roleId" :disabled="true" class="input-select">
          <a-select-option value="3">系统管理员</a-select-option>
          <a-select-option value="5">院系管理员</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="boxSpanSelect">帐号:</span>
        <a-input
          size="small"
          class="input-select boxInput"
          v-model="upDataObj.phone"
          placeholder="请输入人员手机号"
        />
      </div>
      <div class="input-box" v-if="upDataObj.roleId !== '3'">
        <span class="boxSpanSelect">管理学院:</span>
        <college-select
          :value="upDataObj.collageList"
          size="default"
          checkboxMode="multiple"
          @changeVal="(val)=>{this.upDataObj.collageList = val}"
          class="input-select"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import { test, PhoneTest } from "@/unit/formTest";
import { roleControlBtnMixin } from "@/mixin";
const {
  insertSysUser,
  getSysUserList,
  editSysUser,
  delSysUser,
  getSysUser,
  deleteUserList
} = req;

export default {
  name: "Account",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "账号管理",

      columns: [
        {
          title: "角色",
          dataIndex: "roleName"
        },
        {
          title: "账号",
          dataIndex: "phone"
        },
        {
          title: "管理范围",
          customRender: (text, record, index) => {
            return record.roleId === "3" ? (
              <span>全部</span>
            ) : (
              record.collageList &&
                record.collageList.map((ele,index) => <span>{ele.coName}{ record.collageList.length - 1 !== index ? ',':''}</span>)
            );
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.visibleUpdata = !this.visibleUpdata;
                      this.upDataObj = { ...record };
                      if (this.upDataObj.collageList) {
                        const arr = [];
                        this.upDataObj.collageList.forEach(ele => {
                          arr.push(ele.id);
                        });
                        this.upDataObj.collageList = arr;
                      }
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  ""
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
      disabledAdd: false,
      visibleAdd: false, // 弹窗
      visibleUpdata: false, // 弹窗
      roleIdAdd: 3,
      phoneAdd: "",
      collageIdList: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      sysUserList: [],
      spinning: false,
      roleIdSearch: "all",
      phoneSearch: null,
      selectedRowKeys: [],
      upDataObj: {}
    };
  },
  methods: {
    // 添加
    addRole() {
      const { roleIdAdd, phoneAdd, collageIdList, $message } = this;
      const testObj = test(PhoneTest(phoneAdd));
      if (!testObj.status) {
        $message.warning(testObj.msg);
        return;
      }
      if (roleIdAdd !== 3 && collageIdList.length === 0) {
        $message.warning("请选择院系");
        return;
      }
      this.disabledAdd = true
      insertSysUser({
        roleId: roleIdAdd,
        phone: phoneAdd,
        collageIdList: roleIdAdd === 3 ? null : collageIdList
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.visibleAdd = false;
          this.phoneAdd = "";
          this.collageIdList = [];
          this.getAccountList();
        } else {
          $message.warning(msg);
        }
        this.disabledAdd = false
      });
    },
    getAccountList() {
      this.spinning = true;
      const {
        pageinfo: { pageSize, pageNum },
        roleIdSearch,
        phoneSearch,
        $message
      } = this;
      getSysUserList({
        pageSize,
        pageNum,
        roleId: roleIdSearch === "all" ? null : roleIdSearch,
        phone: phoneSearch
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.sysUserList = content;
            this.pageinfo = pageinfo;
            if (this.sysUserList.length === 0) {
              //  $message.warning("未找到人员数据");
            }
          } else {
            $message.warning(msg);
          }
          this.spinning = false;
        },
        () => {
          this.spinning = false;
        }
      );
    },
    delOne (id) {
      // 删除一个
      const { $confirm, $message, getAccountList } = this;
      $confirm({
        title: "提示",
        content: "删除后，将无法还原？",
        onOk: () => {
          delSysUser({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getAccountList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
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
          deleteUserList(selectedRowKeys).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.pageinfo.pageNum = 1;
              this.getAccountList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    upDataRole() {
      const { collageList, roleId, phone, id } = this.upDataObj;
      if (!phone) {
        this.$message.warning('请输入账号！')
        return
      }
      if (roleId === '5' && collageList.length === 0) {
        this.$message.warning('请选择院系！')
        return
      }
      editSysUser({
        id,
        phone,
        roleId,
        collageIdList: collageList
      }).then(({ data: { msg, code } }) => {
        const { $message } = this;
        if (code === 0) {
          $message.success(msg);
          this.visibleUpdata = false;
          this.getAccountList();
        } else {
          $message.warning(msg);
        }
      });
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getAccountList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getAccountList();
    }
  },
  created() {
    this.getAccountList();
  },
  watch: {
    roleIdSearch() {
      this.getAccountList();
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
