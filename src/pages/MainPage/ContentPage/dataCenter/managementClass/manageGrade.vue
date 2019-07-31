<template>
  <div class="manageGrade">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="addGrade" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="addDelGrade" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right"></div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="grade" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--添加-->
    <a-modal
      title="新增"
      v-model="visibleAddGrade"
      @ok="addHandleOkGrade"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span>年级名&nbsp;&nbsp;&nbsp;20</span>
        <a-input-number
          v-model="gradeNum"
          class="input-box-item boxBanModalInput"
          :max="99"
          :min="10"
          :step="1"/>
        <span>&nbsp;&nbsp;级</span>
      </div>
    </a-modal>
    <!--编辑-->
    <a-modal
      title="编辑"
      v-model="visibleSetGrade"
      @ok="setHandleOkGrade"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span>年级名&nbsp;&nbsp;&nbsp;20</span>
        <a-input-number
          v-model="setGradeNum"
          class="input-box-item boxBanModalInput"
          :max="99"
          :min="10"
          :step="1"/>
        <span>&nbsp;&nbsp;级</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import DataTable from '@/components/DataTable'
const {
  queryGradeList, // 获取年级列表
  insertGrade, // 添加年级
  updateGradeByPrimaryKey, // 编辑年级
  deleteGradeByPrimaryKey, // 单项删除
  deleteButchGrade // 批量删除
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "manageGrade",
  components: {
    DataTable
  },
  mixins: [roleControlBtnMixin],
  data () {
    return {
      roleName: "年级管理",
      disabledAdd: false,
      gradeNum: null, // 添加年级
      visibleAddGrade: false, // 添加弹窗
      visibleSetGrade: false, // 编辑弹窗
      setGradeNum: "", // 编辑年级
      idGrade: "", // 编辑id
      columns: [
        {
          title: "年级名",
          dataIndex: "gradeName",
          customRender: (text, record, index) => {
            return "20" + record.gradeName + "级";
          }
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
                      this.setGradeNum = record.gradeName;
                      this.idGrade = record.id;
                      this.visibleSetGrade = !this.visibleSetGrade;
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
                      this.delGradeOne(record.id);
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
      selectedRowKeys: []
    };
  },
  computed: {
    queryObj () {
      return {}
    }
  },
  methods: {
    // 获取年级列表
    getGradeList() {
      this.$refs.table_page.getDataTable()
    },
    // 点击新增
    addGrade () {
      this.visibleAddGrade = !this.visibleAddGrade;
      this.CollegeName = "";
    },
    // 保存添加
    addHandleOkGrade (e) {
      if (!this.gradeNum) {
        this.$message.warning("请输入年级");
        return;
      }
      this.disabledAdd = true
      insertGrade({
        gradeNum: this.gradeNum
      }).then(({ data: { code, msg } }) => {
        this.visibleAddGrade = false;
        if (code === 0) {
          this.gradeNum = "";
          this.$message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          this.$message.warning(msg);
        }
        this.disabledAdd = false
      });
    },
    // 编辑
    setHandleOkGrade() {
      if (!this.setGradeNum) {
        this.$message.warning("请输入年级");
        return;
      }
      updateGradeByPrimaryKey({
        gradeNum: this.setGradeNum,
        id: this.idGrade
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          this.$message.error(msg);
        }
        this.visibleSetGrade = false;
      });
    },
    // 单项删除
    delGradeOne(id) {
      let self = this;
      self.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {
          deleteGradeByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              self.$message.success(msg);
              this.$refs.table_page.refresh()
            } else {
              self.$message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    // 多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 批量删除
    addDelGrade() {
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
          deleteButchGrade({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
              self.$message.success(msg);
            } else {
              self.$message.error(msg);
            }
          });
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
