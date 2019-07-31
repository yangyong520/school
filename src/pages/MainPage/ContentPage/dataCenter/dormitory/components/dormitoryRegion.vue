<template>
  <div class="dormitoryRegion">
    <a-spin :spinning="spinning" tip="导入中...">
      <div class="inner-style">
        <div class="box-left">
          <div class="btn-box">
            <a-button class="btn-item" @click="visible = !visible" v-if="roleDataObj.isAdd">新增</a-button>
          </div>
          <div class="btn-box">
            <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
          </div>
          <div class="btn-box">
            <upload-com @uploadCom="uploadCom" name="studentImg" accept=".xlsx">
              <a-button class="btn-item" v-if="roleDataObj.isImp">导入</a-button>
            </upload-com>
          </div>
        </div>
        <div class="box-right">
          <div class="btn-box">
            <a-input-search
              placeholder="区域名"
              v-model="searchContent"
              @search="searchClick"
              maxlength="20"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              enterButton
            />
          </div>
          <div class="btn-box">
            <a-button class="btn-item" @click="exportFile" v-if="roleDataObj.isExp">导出</a-button>
          </div>
        </div>
      </div>
      <DataTable ref="table_page" :columns="columns" reqType="region" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    </a-spin>
    <!--添加-->
    <a-modal
      title="新增"
      :maskClosable="false"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      v-model="visible"
      @ok="addHandleOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span class="boxSpanInput">区域名:</span>
        <a-input
          class="input-box-item boxInput"
          v-model="areaName"
          placeholder="请输入区域名"
          maxlength="20"
          onkeyup="this.value=this.value.replace(/\s+/g,'')"
        />
      </div>
    </a-modal>
    <!--修改-->
    <a-modal
      title="修改"
      :maskClosable="false"
      v-model="visibleUpdata"
      @ok="addHandleOkUpData"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span class="boxSpanInput">区域名:</span>
        <a-input
          size="small"
          class="input-box-item boxInput"
          v-model="areaNameUpdata"
          placeholder="请输入区域名"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import DataTable from '@/components/DataTable'
import { test, WordTest } from "@/unit/formTest";
const {
  insertArea,
  deleteAreaByPrimaryKey,
  deleteButchArea,
  fileUpload,
  updateAreaByPrimaryKey,
  searchExportArea
} = req;
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";

export default {
  name: "dormitoryRegion",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      disabledAdd: false,
      spinning: false,
      roleName: "区域管理",

      visible: false, // 弹窗
      visibleUpdata: false, // 弹窗
      areaName: "",
      areaNameUpdata: "",
      idUpData: "",
      searchContent: "",
      selectedRowKeys: [],
      columns: [
        {
          title: "区域名",
          key: "areaName",
          dataIndex: "areaName"
        },
        {
          title: "楼栋数量",
          key: "countBuild",
          dataIndex: "countBuild"
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.idUpData = record.id;
                      this.areaNameUpdata = record.areaName;
                      this.visibleUpdata = !this.visibleUpdata;
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
      ]
    };
  },
  computed: {
    queryObj () {
      return {
        areaName: this.searchContent
      }
    }
  },
  methods: {
    exportFile() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择导出数据！");
        return;
      }
      searchExportArea(this.selectedRowKeys).then(
        ({ data: { data, msg, code } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/export/ExportArea?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.warning(msg);
          }
        }
      );
    },
    uploadCom (file, name) {
      this.spinning = true
      let formData = new FormData();
      formData.append("file", file);
      fileUpload(formData).then(({ data: { code, msg } }) => {
        if (code === 500) {
          this.$message.warning(msg);
        } else {
          this.$refs.table_page.refresh()
        }
        this.spinning = false
      });
    },
    addHandleOkUpData() {
      if (!this.areaNameUpdata) {
        this.$message.warning("请输入区域名");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(this.areaNameUpdata, "区域名长度最长20位！")
      );
      if (!sgNumberAddObj.status) {
        this.$message.warning(sgNumberAddObj.msg);
        return;
      }
      updateAreaByPrimaryKey({
        id: this.idUpData,
        areaName: this.areaNameUpdata
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          this.$message.error(msg);
        }
        this.visibleUpdata = false;
      });
    },
    addHandleOk(e) {
      if (!this.areaName) {
        this.$message.warning("请输入区域名");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(this.areaName, "区域名长度最长20位！")
      );
      if (!sgNumberAddObj.status) {
        this.$message.warning(sgNumberAddObj.msg);
        return;
      }
      // 添加
      this.disabledAdd = true
      insertArea({
        areaName: this.areaName
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.areaName = "";
          this.$message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          this.$message.error(msg);
        }
        this.disabledAdd = false
        this.visible = false;
      });
    },
    delOne(id) {
      // 删除一个
      this.$confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteAreaByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.$message.success(msg);
              this.$refs.table_page.refresh()
            } else {
              this.$message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    dleList() {
      // 多项删除
      let ids = "";
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请先选择目标！");
        return;
      }
      this.selectedRowKeys.forEach((ele, index) => {
        if (index === this.selectedRowKeys.length - 1) {
          ids += ele;
        } else {
          ids += ele + ",";
        }
      });
      this.$confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          deleteButchArea({ ids }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.$message.success(msg);
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
            } else {
              this.$message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    searchClick () {
      this.getAreaList();
    },
    getAreaList () {
      this.$refs.table_page.getDataTable()
    }
  },
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
