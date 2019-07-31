<template>
  <div class="manageCollege">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="addCollege" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="showConfirm" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
        <div class="btn-box" v-if="roleDataObj.isImp">
          <UploadFile
            accept=".xlsx"
            action="/importData/batchImportClassInfo"
            @changeFile="changeFile">
            <a-button class="btn-item">导入</a-button>
          </UploadFile>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="学院名"
            v-model="searchContent"
            @search="searchClick"
            enterButton
          />
        </div>
        <div class="btn-box" v-if="roleDataObj.isExp">
          <a-button class="btn-item" @click="exportFile" v-if="roleDataObj.isExp">导出</a-button>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="college" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--添加-->
    <a-modal title="新增" :okButtonProps="{ props: {disabled: disabledAdd} }" v-model="visible" @ok="addHandleOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span class="boxSpanInput">学院名:</span>
        <a-input class="input-box-item boxInput" v-model="CollegeName" placeholder="请输入学院名"/>
      </div>
    </a-modal>
    <!--编辑-->
    <a-modal title="编辑" v-model="setVisible" @ok="SetHandleOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span class="boxSpanInput">学院名:</span>
        <a-input class="input-box-item boxInput" v-model="CollegeNameUpdata" placeholder="请输入学院名"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import UploadFile from "@/components/UploadFile";
import req from "@/req/req";
import { test, WordTest } from "@/unit/formTest";
import { baseUrl } from '@/baseUrl'

const {
  exportXY,
  exportId,
  insertCollege, // 添加
  updateCollegeByPrimaryKey, // 编辑
  deleteCollegeByPrimaryKey, // 单项删除
  deleteButchCollege // 批量删除
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "manageCollege",
  mixins: [roleControlBtnMixin],
  components: {
    UploadFile, DataTable
  },
  data() {
    return {
      roleName: "学院管理",
      disabledAdd: false,
      visible: false, // 新增弹窗
      setVisible: false, // 编辑弹窗
      searchContent: null, // 搜索内容
      selectedRowKeys: [], // 多选
      idUpData: "", // 编辑id
      CollegeNameUpdata: "", // 编辑名字
      CollegeName: "", // 新增名字
      columns: [
        {
          title: "学院名",
          dataIndex: "collegeName"
        },
        {
          title: "专业数",
          dataIndex: "proNumber"
        },
        {
          title: "班级数",
          dataIndex: "classNumber"
        },
        {
          title: "辅导员人数",
          dataIndex: "teacherNumber"
        },
        {
          title: "学生人数",
          dataIndex: "studentNumber"
        },
        {
          title: "操作",
          dataIndex: "password",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.idUpData = record.id;
                      this.CollegeNameUpdata = record.collegeName;
                      this.setVisible = !this.setVisible;
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
        coName: this.searchContent
      }
    }
  },
  methods: {
    exportFile () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择导出数据！')
        return
      }
      exportXY(this.selectedRowKeys).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/export/ExportCollege?ids=' + data
          elemIF.style.display = "none"
          document.body.appendChild(elemIF)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    // 导入成功
    changeFile () {
      this.$refs.table_page.refresh()
    },
    // 获取学院列表
    getCollegeList () {
      this.$refs.table_page.getDataTable()
    },
    // 点击搜索
    searchClick () {
      this.getCollegeList()
    },
    // 多选
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 点击新增
    addCollege() {
      this.visible = !this.visible
      this.CollegeName = ""
    },
    // 添加
    addHandleOk(e) {
      const { CollegeName, $message } = this;
      if (!CollegeName) {
        $message.warning("请输入学院名称");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(CollegeName, "学院名称长度限定20以内！")
      );
      if (!sgNumberAddObj.status) {
        $message.warning(sgNumberAddObj.msg);
        return;
      }
      this.disabledAdd = true
      insertCollege({
        coName: CollegeName
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg)
          this.$refs.table_page.refresh()
          this.visible = false;
        } else {
          $message.error(msg);
        }
        this.disabledAdd = false
      });
    },
    // 编辑
    SetHandleOk(e) {
      const { CollegeNameUpdata, idUpData, $message } = this;
      if (!CollegeNameUpdata) {
        $message.warning("请输入学院名称");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(CollegeNameUpdata, "学院名称长度限定20以内！")
      );
      if (!sgNumberAddObj.status) {
        $message.warning(sgNumberAddObj.msg);
        return;
      }
      updateCollegeByPrimaryKey({
        coName: CollegeNameUpdata,
        id: idUpData
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg)
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.setVisible = false;
      });
    },
    // 批量删除
    showConfirm() {
      let ids = "";
      let self = this;
      if (self.selectedRowKeys.length === 0) {
        self.$message.warning("请先选择目标！");
        return;
      }
      self.selectedRowKeys.forEach((ele, index) => {
        if (index === self.selectedRowKeys.length - 1) {
          ids += ele;
        } else {
          ids += ele + ",";
        }
      });
      self.$confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          deleteButchCollege({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.selectedRowKeys = []
              self.$message.success(msg)
              this.$refs.table_page.refresh()
            } else {
              self.$message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    // 单项删除
    delOne (id) {
      let self = this;
      self.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {
          deleteCollegeByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              self.$message.success(msg)
              this.$refs.table_page.refresh()
            } else {
              self.$message.error(msg);
            }
          })
        },
        onCancel: () => {}
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
