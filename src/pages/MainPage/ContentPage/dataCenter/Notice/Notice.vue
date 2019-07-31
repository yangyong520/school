<template>
  <div class="Notice">
    <Title title="公告管理"/>

    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="$router.push({name: 'NoticeUpData'})"
            v-if="roleDataObj.isAdd"
          >新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box" @click="visible = !visible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>

    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="noticeData"
        :pagination="false"
        rowKey="id">
        <template slot="target" slot-scope="text, record, index">
          <div style="display: flex;flex-wrap: wrap; justify-content: center;">
            <div v-if="record.roleId !== '-1'">{{record.roleName}}-</div>
            <div style="display: flex" v-if="record.roleId !== '2'">
              <!-- 区域 -->
              <div v-if="record.areaId && record.areaId !== '-1'">{{record.areaName}}-</div>
              <!-- 楼栋 -->
              <div v-if="record.buildId && record.buildId !== '-1'">{{record.buildName}}栋-</div>
              <!-- 楼层 -->
              <div v-if="record.floorId && record.floorId !== '-1'">{{record.floorId}}楼-</div>
              <!-- 房间 -->
              <div v-if="record.roomName && record.roomName !== '-1'">{{record.roomName}}室-</div>
            </div>
            <div style="display: flex" v-if="record.roleId !== '4'">
              <!-- 学院 -->
              <div v-for="(item, i) in record.collegeName" :key="i" class="college">
                <div v-if="item.collegeId !== '-1'" class="college-item">{{item.collegeName}}</div>
              </div>
              <!-- 专业 -->
              <div v-for="(item, i) in record.professionName" :key="`${i}-pro`">
                <div v-if="item.id !== '-1'">{{item.proName}}-</div>
              </div>
              <!-- 年纪 -->
              <div v-for="(item, i) in record.gradeName" :key="`${i}-grade`">
                <div v-if="item.id !== '-1'">20{{item.gradeNum || ''}}级-</div>
              </div>
              <!-- 班 -->
              <div v-for="(item, i) in record.className" :key="`${i}-class`">
                <div v-if="item.id !== '-1'">{{item.clName}}班-</div>
              </div>
            </div>
            <div style="display: flex" v-if="record.roleId !== '1'">
              <div v-if="record.education && record.education !== '-1'" >{{educationText(record.education)}}-</div>
            </div>
            <!-- 民族 -->
            <div v-if="record.nation && record.nation !== '-1'">{{record.nation}}-</div>
            <!-- 性别 -->
            <div v-if="record.sex">{{record.sex}}</div>
            <div v-else style="text-align: center;width: 100%">{{showText(record)}}</div>
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

    <!--查询弹窗-->
    <a-modal
      :maskClosable="false"
      title="筛选"
      v-model="visible"
      @ok="handleOkSearch"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>通知状态:</span>
        <a-select v-model="statusSend" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option :value="0">未发送</a-select-option>
          <a-select-option :value="1">已发送</a-select-option>
          <a-select-option :value="2">发送失败</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>提交时间:</span>
        <a-range-picker class="input-select" v-model="arrDate"/>
      </div>
      <div class="input-box">
        <a-button block @click="resetData">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
    <!--详情弹窗-->
    <NoticeDetails
      @okForm="getNoticeList"
      @cgModal="(visible)=>{this.visibleDetails = visible}"
      :visibleContry="visibleDetails"
      :showObj="showObj"
    />
    <!--详情弹窗-->
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
import NoticeDetails from "./NoticeDetails";
const { queryBoardList, deleteBoardByPrimaryKey, deleteButchBoard } = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "Notice",
  components: {
    NoticeDetails
  },
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "公告管理",

      visible: false, // 塞选弹窗
      visibleDetails: false,
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          // width: 200
        },
        {
          title: "发布时间",
          // width: 220,
          customRender: (text, record, index) => {
            return moment(new Date(record.sendTime)).format("llll");
          }
        },
        {
          title: "发送状态",
          // width: 100,
          customRender: (text, record, index) => {
            // 0:未发送 1：已发送 2：发送失败
            if (record.status === 0) {
              return <span>未发送</span>;
            } else if (record.status === 1) {
              return <span>已发送</span>;
            } else {
              return <span>发送失败</span>;
            }
          }
        },
        {
          title: "编辑人",
          dataIndex: "userName",
          // width: 120
        },
        {
          title: "目标人员",
          // width: 500,
          scopedSlots: { customRender: "target" }
        },
        {
          title: "操作",
          // width: 220,
          customRender: (text, record, index) => {
            // 0 表示
            let str = "";
            if (record.status === 0) {
              str = "撤销";
            } else if (record.status === 1) {
              str = "删除";
              } else {
              str = "删除";
            }
            return (
              <div class="todo-box">
                {record.status === 0 ? (
                  this.roleDataObj.isEdit ? (
                    <span
                      onClick={() => {
                        this.showObj = record;
                        this.$router.push({
                          name: "NoticeUpData",
                          query: { id: record.id }
                        });
                      }}
                    >
                      编辑
                    </span>
                  ) : (
                    ''
                  )
                ) : (
                  <span
                    onClick={() => {
                      this.visibleDetails = !this.visibleDetails;
                      this.showObj = record;
                    }}
                  >
                    详情
                  </span>
                )}
                {this.roleDataObj.isDel ? (
                  <span
                    onClick={() => {
                      this.delOne(record.id);
                    }}
                  >
                    {str}
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
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      noticeData: [],
      statusSend: "all",
      showObj: {},
      arrDate: []
    };
  },
  methods: {
    educationText(id) {
      if (id) {
        return {
          0: "大专",
          1: "本科",
          2: "研究生",
          3: "博士"
        }[id];
      }
    },
    showText (item) {
      let str = ''
      const roleName = item.roleId !== '-1' ? item.roleName : ''
      const areaName = item.areaName ? item.areaName : ''
      const buiName = item.buildName ? item.buildName : ''
      const floorId = item.floorId !== '-1' ? item.floorId : ''
      const roomName = item.roomName !== '-1' ? item.roomName : ''
      const collegeName = item.collegeName.every(ele => ele.collegeId !== '-1') ? '1' : ''
      const proName = item.professionName.every(ele => ele.id !== "-1") ? '1' : ''
      const gradeName = item.gradeName.every(x => x.id !== '-1') ? '1' : ''
      const className = item.className.every(x => x.id !== '-1') ? '1' : ''
      const education = item.education !== '-1' ? item.education : ''
      const nation = item.nation !== '-1' ? item.nation : ''
      const sex = item.sex || ''
      if (roleName || areaName || buiName || floorId || roomName || collegeName || proName || gradeName || className || nation || sex || education) {
        return ''
      }
      return '所有人员'
    },
    del() {
      this.$confirm({
        title: "提示",
        content: "删除后，系统将对原住宿人员作退寝处理，是否删除?",
        onOk: () => {},
        onCancel: () => {}
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOkSearch (e) {
      this.visible = false
      this.getNoticeList();
    },
    getNoticeList() {
      this.spinning = true;
      const {
        pageinfo: { pageSize, pageNum },
        $message,
        statusSend,
        arrDate
      } = this;
      queryBoardList({
        pageSize,
        pageNum,
        status: statusSend === "all" ? null : statusSend,
        startTime: arrDate[0] ? moment(arrDate[0]).format("YYYY-MM-DD") : null,
        endTime: arrDate[1] ? moment(arrDate[1]).format("YYYY-MM-DD") : null
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.noticeData = content;
            this.pageinfo = pageinfo;
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
      this.getNoticeList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getNoticeList();
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message, getNoticeList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteBoardByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getNoticeList();
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
          let ids = "";
          selectedRowKeys.forEach((ele, index) => {
            if (index === selectedRowKeys.length - 1) {
              ids += ele;
            } else {
              ids += ele + ",";
            }
          });
          deleteButchBoard({ ids }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              this.getNoticeList();
              this.selectedRowKeys = []
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    resetData() {
      this.arrDate = [];
      this.statusSend = "all";
    }
  },
  created() {
    this.getNoticeList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "NoticeAdd") {
        vm.getNoticeList();
      }
    });
  },
  watch: {
    $route() {
      this.getNoticeList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.w_200px {
  width: 200px;
}
.w_420px {
  width: 420px;
}
.mt_10px {
  margin-top: 10px;
}
.hover-show {
  p {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.college {
  position: relative;
  .college-item::after {
    content: '-',
  }
}
</style>
