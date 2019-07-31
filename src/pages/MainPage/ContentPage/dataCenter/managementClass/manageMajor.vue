<template>
  <div class="manageMajor">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="addProfession" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="showConfirmMarjor" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="专业名"
            @search="searchMajorClick"
            v-model="majorContent"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportZy" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="screenVisible = !screenVisible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="major" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--添加-->
    <a-modal title="新增" :okButtonProps="{ props: {disabled: disabledAdd} }" v-model="MajorAddVisible" @ok="addMajorOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span class="boxBanModalSpan inputSelect span-xinhao">所属学院:</span>
        <a-select v-model="collegeId" placeholder="请选择学院" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="item in collegeArr"
            :key="item.id + 'college'">{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan span-xinhao">专业名称:</span>
        <a-input class="input-box-item boxInput" v-model="professionName" placeholder="请输入专业名"/>
      </div>
    </a-modal>
    <!--编辑-->
    <a-modal title="编辑" v-model="MajorSetVisible" @ok="setMajorOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span class="boxBanModalSpan">所属学院:</span> &nbsp;&nbsp;
        <span>{{MajorObj.collegeName}}</span>
      </div>
      <div class="input-box">
        <span class="boxBanModalSpan span-xinhao">专业名称:</span>
        <a-input
          v-model="MajorObj.professionName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入专业名称"
        />
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--筛选-->
    <a-modal
      title="筛选"
      @cancel="resetSearch"
      v-model="screenVisible"
      @ok="searchMajorClick"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>所属学院:</span>
        <a-select defaultValue="all" placeholder="请选择" v-model="searchMajor" class="input-select">
          <a-select-option :value="'all'">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in collegeArr"
            :key="item.id"
          >{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import DataTable from '@/components/DataTable'
import { test, WordTest } from "@/unit/formTest";
import { baseUrl } from '@/baseUrl'
const {
  queryProfessionList, // 查询列表
  selectCollege, // 查询学院
  queryExportProInfo,
  insertProfession, // 添加
  updateProfessionByPrimaryKey, // 编辑
  deleteProfessionByPrimaryKey, // 单项删除
  deleteButchProfession // 批量删除
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "manageMajor",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "专业管理",
      disabledAdd: false,
      majorContent: "", // 搜索内容
      searchMajor: "all", // 搜索学院
      CollegeName: "", // 新增名字
      collegeArr: [], // 学院
      professionName: "", // 添加专业名称
      collegeId: "", // 添加学院id
      screenVisible: false, // 筛选弹窗
      MajorAddVisible: false, // 新增弹窗
      MajorSetVisible: false, // 编辑弹窗
      MajorObj: {
        coName: "学院名称",
        professionName: "专业名称"
      },
      columns: [
        {
          title: "所属学院",
          dataIndex: "collegeName"
        },
        {
          title: "专业",
          dataIndex: "professionName"
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
                      this.MajorObj = { ...record };
                      this.MajorSetVisible = !this.MajorSetVisible;
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
                      this.delMajorOne(record.id);
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
  created() {
    this.gatCollegeMajorList(); // 获取学院列表
  },
  computed: {
    queryObj () {
      return {
        proName: this.majorContent,
        collegeId: this.searchMajor === "all" ? null : this.searchMajor
      }
    }
  },
  methods: {
    exportZy () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择导出数据！");
        return;
      }
      queryExportProInfo(this.selectedRowKeys).then(
        ({ data: { data, msg, code } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/export/ExportCollege?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.warning(msg);
          }
        }
      );
    },
    // 获取专业列表
    getProfessionList () {
      this.$refs.table_page.getDataTable()
    },
    // 点击搜索
    searchMajorClick() {
      this.screenVisible = false
      this.getProfessionList();
    },
    // 点击新增
    addProfession () {
      this.MajorAddVisible = !this.MajorAddVisible;
      this.professionName = "";
    },
    // 添加
    addMajorOk(e) {
      const { collegeId, professionName, $message } = this;
      if (!collegeId) {
        $message.warning("请选择所属学院");
        return;
      }
      if (!professionName) {
        $message.warning("请输入专业名称");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(professionName, "专业名称长度限定20以内！")
      );
      if (!sgNumberAddObj.status) {
        $message.warning(sgNumberAddObj.msg);
        return;
      }
      this.disabledAdd = true
      insertProfession({
        collegeId: collegeId,
        proName: professionName
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg)
          this.collegeId = ''
          this.MajorAddVisible = false;
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.disabledAdd = false
      });
    },
    // 获取学院列表
    gatCollegeMajorList() {
      const { $message } = this;
      selectCollege().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArr = data;
        } else {
          $message.error(msg);
        }
      });
    },
    // 编辑
    setMajorOk() {
      const {
        $message,
        MajorObj: { id, collegeId, professionName }
      } = this;
      if (!professionName) {
        $message.warning("请输入专业名称");
        return;
      }
      const sgNumberAddObj = test(
        WordTest(professionName, "专业名称长度限定20以内！")
      );
      if (!sgNumberAddObj.status) {
        $message.warning(sgNumberAddObj.msg);
        return;
      }
      updateProfessionByPrimaryKey({
        collegeId: collegeId,
        id: id,
        proName: professionName
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.MajorSetVisible = false;
      });
    },
    // 单项删除
    delMajorOne (id) {
      this.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {
          deleteProfessionByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.$message.success(msg)
              this.$refs.table_page.refresh()
            } else {
              this.$message.error(msg)
            }
          })
        },
        onCancel: () => {}
      });
    },
    // 批量删除
    showConfirmMarjor() {
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
          deleteButchProfession({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
              this.$message.success(msg);
            } else {
              this.$message.error(msg);
            }
          });
        },
      });
    },
    // 重置
    resetSearch() {
      this.searchMajor = "all";
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.inputSelect {
  width: 85px !important;
}
</style>
