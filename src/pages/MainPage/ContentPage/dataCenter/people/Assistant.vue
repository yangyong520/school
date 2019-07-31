<template>
  <div class="Assistant">
    <div class="inner-style">
      <div class="box-left">
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名"
            v-model="nameSearch"
            @search="getAssistantList"
            enterButton
          />
        </div>
        <div class="btn-box" @click="visibleSearch = !visibleSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>

    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="assistantData"
        :pagination="false"
        @change="changePage"
        rowKey="id">
        <template slot="classVoList" slot-scope="row">
          <div v-if="row.classVoList && row.classVoList.length > 1">
            <a-tooltip placement="top" >
              <template slot="title">
                <div v-for="(item, index) in row.classVoList" :key="index">
                  {{item.collegeName}}-{{item.professionName}}-20{{item.gradeName}}级-{{item.className}}班
                </div>
              </template>
              {{row.classVoList[0].collegeName}}-{{row.classVoList[0].professionName}}20{{row.classVoList[0].gradeName}}级-{{row.classVoList[0].className}}班...
            </a-tooltip>
          </div>
          <div v-else>
            <div v-for="(item, index) in row.classVoList" :key="index">
              {{item.collegeName}}-{{item.professionName}}-20{{item.gradeName}}级-{{item.className}}班
            </div>
          </div>
        </template>
      </a-table>
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
    <!-- 修改窗口 -->
    <AssistantModalUpdata
      @okForm="updataAssistant"
      :originObj="upDataObj"
      @cancel="cancelUpdate"
      @cgModal="(visible)=>{this.visibleUpdata = visible}"
      :visibleContry="visibleUpdata"
    />
    <!-- 查询弹窗 -->
    <a-modal :maskClosable="false" title="筛选" v-model="visibleSearch" @ok="searchBtn" okText="查询" class="modal-box">
      <div class="input-box">
        <span>学院:</span>
        <college-select
          :value="collegeIdSearch"
          @changeVal="(val)=>{this.collegeIdSearch = val}"
          size="default"
          width="calc(100% - 50px)"
          :haveAll="true"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>专业:</span>
        <profession-select
          :value="professionIdSearch"
          @changeVal="(val)=>{this.professionIdSearch = val}"
          :collegeId="collegeIdSearch"
          size="default"
          width="calc(100% - 50px)"
          :haveAll="true"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>年级:</span>
        <grade-select
          :value="gradeIdSearch"
          @changeVal="(val)=>{this.gradeIdSearch = val}"
          size="default"
          width="calc(100% - 50px)"
          :haveAll="true"
          class="input-select-lee"
        />
      </div>
      <div class="input-box">
        <span>班级:</span>
        <class-select
          :value="classIdSearch"
          :gradeId="gradeIdSearch"
          :professionId="professionIdSearch"
          size="default"
          width="calc(100% - 50px)"
          :haveAll="true"
          @changeVal="(val)=>{this.classIdSearch = val}"
          class="input-select-lee"
        />
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import UploadFile from "@/components/UploadFile";
import { baseUrl } from '@/baseUrl'
import {
  IDcardTest,
  PhoneTest,
  TepeatArrTest,
  IntegerTest,
  WordTest,
  test,
  NameTest
} from "@/unit/formTest";
import AssistantModal from "./components/AssistantModal";
import AssistantModalUpdata from "./components/AssistantModalUpdata";
const {
  searchExportTeacher,
  insertTeacher,
  queryTeacherList,
  updateTeacherByPrimaryKey,
  deleteTeacherByPrimaryKey,
  deleteButchTeacher
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "Assistant",
  components: {
    AssistantModal,
    AssistantModalUpdata,
    UploadFile
  },
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "辅导员",
      disabledAdd: false,
      size: "default",
      columns: [
        {
          title: '照片',
          customRender: (text, row, index) => {
            return (
              <img class="avatar" src={row.userPicth} />
            )
          }
        },
        {
          title: "姓名",
          dataIndex: "teacherName"
        },
        {
          title: "工号",
          dataIndex: "teacherNum"
        },
        {
          title: "性别",
          dataIndex: 'sex'
        },
        {
          title: "手机号码",
          dataIndex: "teacherPhone"
        },
        {
          title: "管理班级",
          scopedSlots: { customRender: 'classVoList' }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.upDataObj = record;
                      if (record.classVoList && record.classVoList.length === 0) {
                        this.upDataObj.classVoList = [
                          {
                            collegeId: '',
                            professionId: '',
                            gradeId: '',
                            classId: ''
                          }
                        ]
                      }
                      this.visibleUpdata = !this.visibleUpdata;
                    }}>
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
      selectedRowKeys: [],
      spinning: false,
      visibleSet: false, // 塞选弹窗
      visibleUpdata: false, // 修改
      visibleSearch: false, // 塞选弹窗
      teacherNum: "",
      assistantData: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      upDataObj: {},
      collegeIdSearch: "all",
      professionIdSearch: "all",
      gradeIdSearch: "all",
      classIdSearch: "all",
      sexSearch: "all",
      nameSearch: ""
    };
  },
  created() {
    this.getAssistantList();
  },
  methods: {
    cancelUpdate () {
      this.getAssistantList()
    },
    resetSearch() {
      this.collegeIdSearch = "all";
      this.professionIdSearch = "all";
      this.gradeIdSearch = "all";
      this.classIdSearch = "all";
      // this.sexSearch = "all";
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message, getAssistantList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteTeacherByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getAssistantList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    getAssistantList() {
      const {
        pageinfo: { pageSize, pageNum },
        $message,
        collegeIdSearch,
        professionIdSearch,
        gradeIdSearch,
        classIdSearch,
        nameSearch
      } = this;
      this.spinning = true;
      queryTeacherList({
        pageSize,
        pageNum,
        collegeId: collegeIdSearch === "all" ? null : collegeIdSearch,
        classId: classIdSearch === "all" ? null : classIdSearch,
        professionId: professionIdSearch === "all" ? null : professionIdSearch,
        gradeId: gradeIdSearch === "all" ? null : gradeIdSearch,
        val: nameSearch ? nameSearch : null
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.assistantData = content;
            this.pageinfo = pageinfo;
            if (this.assistantData.length === 0) {
              //  $message.warning("未找到辅导员数据");
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
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getAssistantList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getAssistantList();
    },
    updataAssistant(obj) {
      const {
        id,
        classVoList,
        $message
      } = obj;
      let arr = classVoList.map(x => {
        return x.classId
      })
      let objSend = {
        classVoList: arr,
        id
      };
      updateTeacherByPrimaryKey(objSend).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getAssistantList();
          this.visibleUpdata = false;
        } else {
          $message.warning(msg);
        }
      });
    },
    searchBtn() {
      this.getAssistantList();
      this.visibleSearch = false;
    }
  },
};
</script>

<style scoped lang="less">
@import '~@/global';

.ant-select {
  margin-left: 18px;
}
</style>
