<template>
  <div class="BreakRuleNotes">
    <!--头部-->
    <Title title="违纪记录"/>
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="addBreakButton" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            v-model="val"
            @search="handleSearchBreak"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportWj" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visibleBreakRule = !visibleBreakRule">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--头部-->
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="breakRuleList"
        :pagination="false"
        rowKey="id"
      />
    </a-spin>
    <!--列表-->
    <!--新增弹窗-->
    <a-modal
      title="新增"
      :maskClosable="false"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      v-model="visibleBreakRuleAdd"
      @ok="handleBreakAddOk"
      okText="确定"
      class="modal-box">
      <span class="span-xinhao">学号：</span>
      <a-input-search
        class="w_200px"
        v-model="userNum"
        placeholder="学号"
        type="number"
        @search="getStudentByUserNum"
        enterButton
      />
      <div class="clearfix"></div>
      <span class="span-xinhao">标题：</span>
      <a-input class="w_200px mt_10px" v-model="titleAdd" placeholder="标题"/>
      <div class="clearfix"></div>
      <div style="display: flex; align-items: flex-start;margin-top: 10px;">
        <span class="span-xinhao">内容：</span>
        <a-textarea class="w_420px" v-model="content" placeholder="内容"/>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div v-if="isUserId && isSearchData">
        <div class="visible-notes-img">
          <img :src="searchData.userPicth" alt>
        </div>
        <div class="visibleNotesDeail">
          <div class="visibleNotesDeailDiv">
            <label>姓名：</label>
            <span>{{searchData.studentName}}</span>
          </div>
          <div class="visibleNotesDeailDiv">
            <label>学号：</label>
            <span>{{searchData.userNum}}</span>
          </div>
          <div class="visibleNotesDeailDiv">
            <label>性别：</label>
            <span>{{searchData.sex}}</span>
          </div>
          <div class="visibleNotesDeailDiv">
            <label>手机号码：</label>
            <span>{{searchData.phone}}</span>
          </div>
          <div class="visibleNotesDeailDiv">
            <label>辅导员：</label>
            <span>{{searchData.teacherName}}</span>
          </div>
          <div class="visibleNotesDeailDiv">
            <label>手机号码：</label>
            <span>{{searchData.teacherPhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>班级信息：</label>
            <span>{{searchData.collegeName}}-{{searchData.proName}}-20{{searchData.gradeName}}级-{{searchData.className}}班</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>房间信息：</label>
            <span>{{searchData.areaName}}-{{searchData.buildName}}-{{searchData.roomNum}}-{{searchData.bedNum}}</span>
          </div>
        </div>
      </div>
      <div v-else-if="isUserId">
        <p class="breakP">学号错误，无对应学生</p>
      </div>
      <div v-else>
        <p class="breakP">请输入学号查询</p>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--新增弹窗-->
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleBreakRule"
      @ok="handleSearchBreak"
      okText="筛选"
      class="modal-box">
      <div class="input-box">
        <span>处理情况:</span>
        <a-select v-model="status" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">未处理</a-select-option>
          <a-select-option value="1">已处理</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>提交时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="BreakDate"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="breakClearSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <a-modal
      title="违纪记录"
      :maskClosable="false"
      v-model="visibleSetBreak"
      @ok="breakSetSubmit"
      okText="确定"
      :class="leaveSet">
      <div class="visible-notes-img">
        <img v-if="BreakRuleObj.studentForm" :src="BreakRuleObj.studentForm.userPicth" alt>
      </div>
      <div class="visibleNotesDeail" v-if="BreakRuleObj.studentForm">
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>姓名：</label>
          <span>{{BreakRuleObj.studentForm.studentName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>学号：</label>
          <span>{{BreakRuleObj.studentForm.userNum}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>性别：</label>
          <span>{{BreakRuleObj.studentForm.sex}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{BreakRuleObj.studentForm.phone}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 45%">
          <label>辅导员：</label>
          <span>{{BreakRuleObj.studentForm.teacherName}}</span>
        </div>
        <div class="visibleNotesDeailDiv" style="width: 55%">
          <label>手机号码：</label>
          <span>{{BreakRuleObj.studentForm.teacherPhone}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>班级信息：</label>
          <span>{{BreakRuleObj.studentForm.collegeName}}-{{BreakRuleObj.studentForm.proName}}-20{{BreakRuleObj.studentForm.gradeName}}级-{{BreakRuleObj.studentForm.className}}班</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>房间信息：</label>
          <span>{{BreakRuleObj.studentForm.areaName}}-{{BreakRuleObj.studentForm.buildName}}-{{BreakRuleObj.studentForm.roomNum}}室-{{BreakRuleObj.studentForm.bedNum}}号床</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div class="visibleNotesDeailCont">
        <div class="visibleNotesDeailDiv">
          <label>提交人：</label>
          <span>{{BreakRuleObj.submitUsrName}}</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>角色：</label>
          <span v-if="BreakRuleObj.submitUserRole">
            <span v-if="BreakRuleObj.submitUserRole === 'STUDENT'">学生</span>
            <span v-else-if="BreakRuleObj.submitUserRole === 'TEACHER'">辅导员</span>
            <span v-else-if="BreakRuleObj.submitUserRole === 'super_admin'">系统管理员</span>
            <span v-else-if="BreakRuleObj.submitUserRole === 'SGADMIN'">宿管</span>
            <span v-else-if="BreakRuleObj.submitUserRole === 'DEPART'">院系管理员</span>
            <span v-else-if="BreakRuleObj.submitUserRole === 'PARENT'">家长</span>
            <span v-else>{{BreakRuleObj.submitUserRole}}</span>
          </span>
          <span v-else>无</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>联系方式：</label>
          <span>{{BreakRuleObj.submitUserPhone}}</span>
        </div>
        <div class="visibleNotesDeailDiv">
          <label>提交时间：</label>
          <span>{{BreakRuleObj.modifyTime}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>标题：</label>
          <span>{{BreakRuleObj.title}}</span>
        </div>
        <div class="visibleNotesDeailDivP">
          <label>内容：</label>
          <span>{{BreakRuleObj.content}}</span>
        </div>
        <div class="visibleNotesDeailDivP" v-if="BreakRuleObj.status == 0">
          <label>处理意见：</label>
          <a-input size="small" class="input-box-item" v-model="reason" :style="{width: '400px'}"/>
        </div>
        <div v-else>
          <div class="visibleNotesDeailDivP">
            <label>处理人：</label>
            <span v-if="BreakRuleObj.handleRole === 'STUDENT'">学生</span>
            <span v-if="BreakRuleObj.handleRole === 'TEACHER'">辅导员</span>
            <span v-if="BreakRuleObj.handleRole === 'super_admin'">系统管理员</span>
            <span v-if="BreakRuleObj.handleRole === 'SGADMIN'">宿管</span>
            <span v-if="BreakRuleObj.handleRole === 'DEPART'">院系管理员</span>
            <span v-if="BreakRuleObj.handleRole === 'PARENT'">家长</span>
            <span v-else>{{BreakRuleObj.handleRole}}-</span>
            <span>{{BreakRuleObj.handleName}}-{{BreakRuleObj.handlePhone}}</span>
          </div>
          <div class="visibleNotesDeailDivP">
            <label>处理意见：</label>
            <span>{{BreakRuleObj.handleReason}}</span>
          </div>
        </div>
      </div>
    </a-modal>
    <!--详情弹窗-->
    <!--分页-->
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :current="pageinfo.pageNum"
        :total="pageinfo.totalElements"
        showSizeChanger
        showQuickJumper
        :pageSize="pageinfo.pageSize"
        @change="changePage"
        @showSizeChange="changeSize"
      />
    </div>
    <!--分页-->
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
import { test, WordTest, WordLangTest } from "@/unit/formTest";
const {
  queryExportBreakRule,
  queryRecordList, // 获取违纪记录
  insert, // 添加违纪记录
  selectStudentByUserNum, // 根据学号查询学生信息
  breakRuleRecord //立即处理违纪
} = req;
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";

export default {
  name: "BreakRuleNotes",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      spinning: false,
      roleName: "违纪记录",
      disabledAdd: false,
      selectedRowKeys: [],
      breakRuleList: [], //违纪列表
      BreakDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      status: "all", //查询状态
      val: "", //查询姓名/学号
      visibleBreakRule: false, // 查询弹窗
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      leaveSet: {
        isDisplayNo: false
      },
      visibleBreakRuleAdd: false, // 新增弹窗
      userNum: "", //新增学生学号
      userId: "", //新增学生id
      titleAdd: "", //新增标题
      content: "", //新增内容
      isUserId: false, //添加是否输入了学号
      isSearchData: false, //添加查询的学号是否有学生
      searchData: {
        //查询的学生信息
        userId: "", //学生id
        userPicth: "", //照片
        studentName: "", //姓名
        userNum: "", //学号
        sex: "", //性别
        phone: "", //手机号码
        teacherName: "", //辅导员姓名
        teacherPhone: "", //辅导员手机号
        collegeName: "", //院系
        proName: "", //专业
        gradeName: "", //年级
        className: "", //班级
        areaName: "", //区域
        buildName: "", //楼栋
        roomNum: "" //房间
      },
      BreakRuleObj: {
        //立即处理/查看的数据
        id: "",
        studentForm: {}
      }, //查看详情数据
      reason: "", //处理意见
      visibleSetBreak: false, // 查看弹窗
      columns: [
        {
          title: "姓名",
          dataIndex: "userName"
        },
        {
          title: "学号",
          dataIndex: "userNum"
        },
        {
          title: "违纪标题",
          dataIndex: "title"
        },
        {
          title: "处理意见",
          dataIndex: "opinion",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return <div style="color: red;">未处理</div>;
            } else {
              return <div>已处理</div>;
            }
          }
        },
        {
          title: "处理时间",
          dataIndex: "time",
          customRender: (text, record, index) => {
            return record.handleTime ? record.handleTime : "——";
          }
        },
        {
          title: "处理人",
          dataIndex: "people",
          customRender: (text, record, index) => {
            return record.handleName ? record.handleName : "——";
          }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return this.roleDataObj.isDeal ? (
                <div class="todo-box">
                  <span
                    onClick={() => {
                      this.BreakRuleObj = { ...record };
                      this.visibleSetBreak = !this.visibleSetBreak;
                      this.leaveSet.isDisplayNo = false;
                    }}
                  >
                    立即处理
                  </span>
                </div>
              ) : (
                ""
              );
            } else {
              return (
                <div class="todo-box">
                  <span
                    style="background-color: #ffc424;"
                    onClick={() => {
                      this.BreakRuleObj = { ...record };
                      this.visibleSetBreak = !this.visibleSetBreak;
                      this.leaveSet.isDisplayNo = true;
                    }}
                  >
                    查看详情
                  </span>
                </div>
              );
            }
          }
        }
      ]
    };
  },
  created() {
    this.getBreakRuleList(); // 获取违纪列表
  },
  methods: {
    exportWj () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryExportBreakRule(this.selectedRowKeys).then(({data: {msg, code, data}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/export/ExportBreakRule?ids=' + data
          elemIF.style.display = "none"
          document.body.appendChild(elemIF)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    //获取违纪列表
    getBreakRuleList() {
      this.spinning = true;
      queryRecordList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        status: this.status === "all" ? null : this.status,
        startTime: this.startTime,
        endTime: this.endTime,
        val: this.val
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.breakRuleList = content;
            this.pageinfo = pageinfo;
            if (this.breakRuleList.length === 0) {
              // this.$message.warning('未找到违纪记录数据')
            }
          } else {
            this.$message.warning(msg);
          }
          this.spinning = false;
        },
        () => {
          this.spinning = false;
        }
      );
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //筛选
    handleSearchBreak() {
      if (this.BreakDate[0]) {
        this.startTime = this.BreakDate[0].format("YYYY-MM-DD");
        this.endTime = this.BreakDate[1].format("YYYY-MM-DD");
      }
      this.pageinfo.pageNum = 1;
      this.visibleBreakRule = false;
      this.getBreakRuleList();
    },
    // 切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getBreakRuleList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getBreakRuleList();
    },
    //点击新增
    addBreakButton() {
      this.visibleBreakRuleAdd = !this.visibleBreakRuleAdd;
      this.userNum = "";
      this.titleAdd = "";
      this.content = "";
      this.isUserId = false;
      this.isSearchData = false;
    },
    //新增保存
    handleBreakAddOk() {
      const { isSearchData, isUserId, titleAdd, content, $message } = this;
      const { userId, studentName, userNum } = this.searchData;
      if (!isUserId) {
        $message.warning("请查询正确学生信息！");
        return;
      }
      if (!isSearchData) {
        $message.warning("请查询正确学生信息！");
        return;
      }
      if (!titleAdd) {
        $message.warning("请输入标题！");
        return;
      }
      const titleObj = test(WordTest(titleAdd, "标题长度最长20位！"));
      if (!titleObj.status) {
        $message.warning(titleObj.msg);
        return;
      }
      if (!content) {
        $message.warning("请输入内容！");
        return;
      }
      const contentObj = test(WordLangTest(content, "内容长度最长140位！"));
      if (!contentObj.status) {
        $message.warning(contentObj.msg);
        return;
      }
      this.disabledAdd = true
      insert({
        userId,
        userName: studentName,
        userNum,
        title: titleAdd,
        content
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.getBreakRuleList();
        } else {
          this.$message.error(msg);
        }
        this.disabledAdd = false
        this.visibleBreakRuleAdd = false;
      });
    },
    //根据学号查询学生信息
    getStudentByUserNum() {
      const { userNum, $message } = this;
      if (!userNum) {
        $message.warning("请输入学号！");
        return;
      }
      selectStudentByUserNum({
        userNum
      }).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          if (data) {
            this.searchData = data;
            this.isSearchData = true;
            this.isUserId = true;
          } else {
            this.isUserId = true;
            this.isSearchData = false;
          }
        } else {
          $message.error(msg);
        }
      });
    },
    //重置
    breakClearSearch() {
      this.status = "all";
      this.BreakDate = [];
      this.startTime = "";
      this.endTime = "";
    },
    //立即处理
    breakSetSubmit() {
      if (this.BreakRuleObj.status == 0) {
        const { id } = this.BreakRuleObj;
        const {
          reason, //
          $message
        } = this;
        if (!reason) {
          $message.warning("请输入处理意见！");
          return;
        }
        const reasonObj = test(WordTest(reason, "处理意见长度最长20位！"));
        if (!reasonObj.status) {
          $message.warning(reasonObj.msg);
          return;
        }
        breakRuleRecord({
          id,
          reason,
          status: 1
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.getBreakRuleList();
            this.reason = ''
          } else {
            this.$message.error(msg);
          }
          this.visibleSetBreak = false;
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.breakP {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.w_200px {
  width: 200px;
}
.w_420px {
  width: 420px;
}
.mt_10px {
  margin-top: 10px;
}
</style>
