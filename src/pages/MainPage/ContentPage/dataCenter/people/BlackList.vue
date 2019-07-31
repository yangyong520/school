<template>
  <div class="BlackList">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left">
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名" @search="searchBlack" v-model="val" enterButton/>
        </div>
      </div>
    </div>
    <!--头部-->
    <DataTable ref="table_page" :columns="columns" reqType="blackPer" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--编辑弹窗-->
    <a-modal
      title="编辑"
      :maskClosable="false"
      v-model="visibleBalckSet"
      @ok="setBlackOk"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="visible-notes-img" style="width: 100px;height: 100px">
        <img :src="blackContData.picth" alt>
      </div>
      <div class="studentDiv" style="width: 495px">
        <div class="visibleNotesDeailDiv new-label-width">
          <label>姓名:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.userName"
            placeholder="请输入姓名"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>性别:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.sex"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>年龄:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.age"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>身份证:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.idNum"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>户籍地:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.nativePlace"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>事由:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.reason"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>来源:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="blackContData.messageSource"
          />
        </div>
      </div>
      <div class="clearfix"></div>
      <label>备注:</label>
      <a-textarea :rows="4" placeholder="请输入备注" v-model="blackContData.remark"/>
      <div class="border_eeeMtB10"></div>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import UploadFile from "@/components/UploadFile"
import { test, NameTest } from "@/unit/formTest";
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from '@/baseUrl'
import req from "@/req/req";

const {
  searchExportBlack,
  insertBlackPeople, //添加黑名单
  uploadBlack,
  deleteBlackPropleByPrimaryKey, //单项删除黑名单
  updateBlackPeopleByPrimaryKey, //编辑黑名单
  deleteBlackPeopleButch // 批量删除黑名单信息
} = req;
export default {
  name: "BlackList",
  mixins: [roleControlBtnMixin],
  components: {
    UploadFile, DataTable
  },
  data() {
    return {
      val: "", //查询姓名
      userName: "", //添加名字
      picth: "", //添加图片file
      remark: "", //添加备注
      blackContData: {
        userName: "", //名字
        picth: "", //图片
        remark: "", //备注
        picthFile: "" //图片file
      },
      visibleBalckSet: false, // 编辑弹窗
      columns: [
        {
          title: "照片",
          customRender: (text, record, index) => {
            return <img class="img-header" style="width: 50px;height:50px" src={record.picth} />;
          }
        },
        {
          title: "姓名",
          dataIndex: "userName"
        },
        {
          title: '性别',
          dataIndex: 'sex'
        },
        {
          title: '年龄',
          dataIndex: 'age'
        },
        {
          title: '身份证',
          customRender: (text, row, index) => {
            return row.idNum || '未填写'
          }
        },
        {
          title: '户籍地',
          customRender: (text, row, index) => {
            return row.nativePlace || '未填写'
          }
        },
        {
          title: '事由',
          dataIndex: 'reason'
        },
        {
          title: '来源',
          dataIndex: 'messageSource'
        },
        {
          title: "备注信息",
          dataIndex: "remark",
          customRender: (text, record, index) => {
            return record.remark ? record.remark : "未填写";
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
                      this.blackContData = { ...record };
                      this.visibleBalckSet = !this.visibleBalckSet;
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    queryObj () {
      return {
        userName: this.val
      }
    }
  },
  methods: {
    getBlackList () {
      this.$refs.table_page.getDataTable()
    },
    // 查询
    searchBlack () {
      this.getBlackList()
    },
    // 编辑保存
    setBlackOk () {
      const { remark, id } = this.blackContData
      var dataSetCont = {
        remark,
        id
      };
      updateBlackPeopleByPrimaryKey(dataSetCont).then(
        ({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.$refs.table_page.refresh()
          } else {
            this.$message.error(msg);
          }
          this.visibleBalckSet = false;
        }
      );
    },
  },
};
</script>

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

.pagination-page-box {
  display: flex;
  justify-content: flex-end;
  .pagination-page {
    padding: 10px 0;
  }
}

</style>
