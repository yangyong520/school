<template>
  <div class="Camera">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="visible = !visible" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box" @click="visibleModal = !visibleModal">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>

    <a-spin :spinning="spinning">
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="cameraData"
        :pagination="false"
        @change="changePage"
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
    <!-- 添加 -->
    <a-modal
      :maskClosable="false"
      title="新增"
      v-model="visible"
      @ok="handleOkAdd"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      okText="确定"
      class="modal-box">
      <div class="input-box xinhao">
        <span class="boxSpanInput">设备名称:</span>
        <a-input size="small" style="width: 230px" v-model="name" class="input-box-item boxInput" placeholder="请输入设备名称"/>
      </div>
      <div class="input-box">
        <span class="boxSpanInput">保修日期:</span>
        <a-range-picker @change="getDate" style="width: 230px" format="YYYY-MM-DD" class="input-box-item boxInput"/>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在区域:</span>
        <a-select class="input-select" style="width: 230px" v-model="areaIdAdd" @change="handleChangeArea">
          <a-select-option
            v-for="item in areaListArr"
            :key="item.id"
            :value="item.id"
          >{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在楼栋:</span>
        <a-select v-model="buildIdAdd" style="width: 230px" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="(item) in buildListArr"
            :key="item.id + '-build'"
          >{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box" :style="{justifyContent: 'flex-end'}">
        <a-input
          size="small"
          :style="{width: '60%'}"
          class="input-box-item boxInput"
          v-model="door"
          placeholder="1-9"
        />&nbsp;号门
        <!-- <a-input
          size="small"
          :style="{width: '24%'}"
          v-model="machine"
          class="input-box-item boxInput"
          placeholder="请输入号机"
        />&nbsp;号机 -->
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">账号:</span>
        <a-input
          style="width: 230px"
          size="small"
          v-model="account"
          class="input-box-item boxInput"
          placeholder="请输入账号"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">密码:</span>
        <a-input
          size="small"
          style="width: 230px"
          v-model="password"
          type="password"
          class="input-box-item boxInput"
          placeholder="请输入密码"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">IP:</span>
        <a-input size="small" style="width: 230px" v-model="ip" class="input-box-item boxInput" placeholder="请输入IP"/>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">端口:</span>
        <a-input size="small" style="width: 230px" v-model="port" class="input-box-item boxInput" placeholder="请输入端口"/>
      </div>
    </a-modal>
    <!-- 编辑 -->
    <a-modal
      :maskClosable="false"
      title="编辑"
      v-model="visibleWrite"
      @ok="handleOkUpdata"
      okText="确定"
      class="modal-box">
      <div class="input-box xinhao">
        <span class="boxSpanInput">设备名称:</span>
        <a-input
          size="small"
          style="width: 230px"
          v-model="objWrite.name"
          class="input-box-item boxInput"
          placeholder="请输入设备名称"
        />
      </div>
      <div class="input-box">
        <span class="boxSpanInput">保修日期:</span>
        <a-range-picker format="YYYY-MM-DD" style="width: 230px" v-model="writeDate" class="input-box-item boxInput"/>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在区域:</span>
        <a-select class="input-select" style="width: 230px" v-model="objWrite.areaId" @change="handleChangeAreaWrite">
          <a-select-option v-for="item in areaListArr" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在楼栋:</span>
        <a-select style="width: 230px" v-model="objWrite.buildId" class="input-select">
          <a-select-option v-for="(item) in buildListArrWrite" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box" :style="{justifyContent: 'flex-end'}">
        <a-input
          size="small"
          :style="{width: '60%'}"
          class="input-box-item boxInput"
          placeholder="请输入号门"
          v-model="objWrite.door"
        />&nbsp;号门
        <!-- <a-input
          size="small"
          :style="{width: '24%'}"
          v-model="objWrite.machine"
          class="input-box-item boxInput"
          placeholder="请输入号机"
        />&nbsp;号机 -->
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">账号:</span>
        <a-input
          style="width: 230px"
          size="small"
          v-model="objWrite.account"
          class="input-box-item boxInput"
          placeholder="请输入账号"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">密码:</span>
        <a-input
          style="width: 230px"
          size="small"
          v-model="objWrite.password"
          class="input-box-item boxInput"
          placeholder="请输入密码"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">IP:</span>
        <a-input
          size="small"
          style="width: 230px"
          v-model="objWrite.ip"
          class="input-box-item boxInput"
          placeholder="请输入IP"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">端口:</span>
        <a-input
          size="small"
          style="width: 230px"
          v-model="objWrite.port"
          class="input-box-item boxInput"
          placeholder="请输入端口"
        />
      </div>
    </a-modal>
    <!-- 筛选 -->
    <a-modal
      :maskClosable="false"
      title="筛选"
      v-model="visibleModal"
      @ok="searchBtn"
      okText="查询"
      class="modal-box">
      <div class="input-box srarch">
        <span>状态:</span>
        <a-select defaultValue="all" v-model="statusSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option :value="0">离线</a-select-option>
          <a-select-option :value="1">在线</a-select-option>
        </a-select>
      </div>
      <div class="input-box srarch">
        <span>区域:</span>
        <a-select
          placeholder="请先选择区域"
          class="input-select"
          v-model="areaIdSearch"
          @change="handleChangeAreaSearch">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            v-for="(item) in areaListArr"
            :key="item.id"
            :value="item.id"
          >{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box srarch">
        <span>楼栋:</span>
        <a-select v-model="buildIdSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="(item) in buildListArrSearch"
            :key="item.id + '-build'"
          >{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box srarch">
        <span>保修期:</span>
        <a-select defaultValue="all" v-model="guarenteenStatusSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option :value="0">在保</a-select-option>
          <a-select-option :value="1">过保</a-select-option>
          <a-select-option :value="2">即将过保</a-select-option>
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
import moment from "moment";
const {
  insertCamera,
  deleteCameraByPrimaryKey,
  deleteButchCamera,
  selectBuildList,
  selectAreaList,
  queryCameraList,
  updateCameraByPrimaryKey
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "Camera",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "摄像头",
      disabledAdd: false,
      msg: "Welcome to Your Vue.js App",
      visibleModal: false,
      selectedRowKeys: [],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name"
        },
        {
          title: "IP",
          dataIndex: "ip"
        },
        {
          title: "状态",
          customRender: (text, record, index) => {
            return record.status === 0 ? (
              <span> 离线 </span>
            ) : (
              <span>在线</span>
            );
          }
        },
        {
          title: "保修期",
          customRender: (text, record, index) => {
            function getStatus() {
              if (record.guarenteenStatus === 0) {
                return <span>在保</span>;
              } else if (record.guarenteenStatus === 1) {
                return <span style="color: red">过保</span>;
              } else {
                return <span style="color: red">即将过保</span>;
              }
            }
            return <div>{getStatus()}</div>;
          }
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
                      this.objWrite = { ...record };
                      this.getBuildListWrite(this.objWrite.areaId);
                      this.writeDate = [
                        moment(this.objWrite.guarenteenStart, "YYYY-MM-DD"),
                        moment(this.objWrite.guarenteenEnd, "YYYY-MM-DD")
                      ];
                      this.visibleWrite = !this.visibleWrite;
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  <span style="display: none" />
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
      visible: false, // 添加弹窗
      areaIdAdd: null,
      buildIdAdd: null,
      buildListArr: [],
      areaListArr: [],
      name: "",
      dateFix: [],
      door: "",
      machine: "",
      account: "",
      password: "",
      ip: "",
      port: "",
      cameraData: [],
      spinning: false,
      statusSearch: "all",
      guarenteenStatusSearch: "all",
      areaIdSearch: "all",
      buildIdSearch: "all",
      buildListArrSearch: [],
      visibleWrite: false,
      objWrite: {}, // 修改部分
      writeDate: [new Date(), new Date()],
      buildListArrWrite: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      }
    };
  },
  methods: {
    moment,
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOkAdd() {
      if (!this.name) {
        this.$message.warning('请输入设备名称！')
        return
      }
      if (!this.areaIdAdd) {
        this.$message.warning('请选择区域！')
        return
      }
      if (!this.buildIdAdd) {
        this.$message.warning('请选择楼栋！')
        return
      }
      if (!this.door) {
        this.$message.warning('请输入门号！')
        return
      }
      if (this.door.length > 1) {
        this.$message.warning('门号不能大于9！')
        return
      }
      // if (!this.machine) {
      //   this.$message.warning('请输入机位！')
      //   return
      // }
      if (!this.account) {
        this.$message.warning('请输入账号！')
        return
      }
      if (!this.password) {
        this.$message.warning('请输入密码！')
        return
      }
      if (!this.ip) {
        this.$message.warning('请输入ip！')
        return
      }
      if (!this.port) {
        this.$message.warning('请输入端口号！')
        return
      }
      const {
        name,
        ip,
        dateFix,
        account,
        password,
        port,
        buildIdAdd,
        areaIdAdd,
        door,
        // machine
      } = this;
      this.disabledAdd = true
      insertCamera({
        name,
        ip,
        guarenteenStart: dateFix[0],
        guarenteenEnd: dateFix[1],
        account,
        password,
        port,
        buildId: buildIdAdd,
        areaId: areaIdAdd,
        door,
        // machine
      }).then(({ data: { code, data, msg } }) => {
        const { $message } = this;
        if (code === 0) {
          $message.success(msg);
          this.getCamerList();
        } else {
          $message.error(msg);
        }
        this.disabledAdd = true
        this.visible = false;
      });
    },
    getCamerList() {
      const {
        pageinfo: { pageSize, pageNum },
        statusSearch,
        guarenteenStatusSearch,
        areaIdSearch,
        buildIdSearch,
        $message
      } = this;
      this.spinning = true;
      queryCameraList({
        pageSize,
        pageNum,
        status: statusSearch === "all" ? null : statusSearch,
        areaId: areaIdSearch === "all" ? null : areaIdSearch,
        buildId: buildIdSearch === "all" ? null : buildIdSearch,
        guarenteenStatus:
          guarenteenStatusSearch === "all" ? null : guarenteenStatusSearch
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.cameraData = content;
            this.pageinfo = pageinfo;
            if (this.cameraData.length === 0) {
              // $message.warning("未找到摄像头数据");
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
    getDate(date, dateString) {
      this.dateFix = dateString;
    },
    handleChangeArea() {
      const { areaIdAdd } = this;
      this.buildIdAdd = null;
      this.roomIdAdd = null;
      this.getBuildList(areaIdAdd);
    },
    handleChangeAreaSearch() {
      const { areaIdSearch } = this;
      this.buildIdSearch = null;
      this.getBuildListSearch(areaIdSearch);
    },
    handleChangeAreaWrite() {
      const {
        objWrite: { areaId }
      } = this;
      this.objWrite.buildId = null;
      this.getBuildListWrite(areaId);
    },
    getBuildList(areaId) {
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArr = data;
        }
      });
    },
    getBuildListSearch(areaId) {
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArrSearch = data;
        }
      });
    },
    getBuildListWrite(areaId) {
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArrWrite = data;
        }
      });
    },
    handleChangeBuild() {
      this.roomIdAdd = null;
      this.floorNum = null;
      const { floorNum, buildIdAdd } = this;
      selectRoomList({
        buildId: buildIdAdd
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.roomIdAdd = null;
          this.roomListArr = data;
        }
      });
    },
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaListArr = data;
        } else {
          $message.error(msg);
        }
      });
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteCameraByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              this.getCamerList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
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
          deleteButchCamera({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.pageinfo.pageNum = 1;
              this.getCamerList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    resetSearch() {
      this.statusSearch = "all";
      this.guarenteenStatusSearch = "all";
      this.areaIdSearch = "all";
      this.buildIdSearch = "all";
      this.buildListArrSearch = [];
    },
    searchBtn() {
      this.visibleModal = false;
      this.pageinfo.pageNum = 1;
      this.getCamerList();
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getCamerList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getCamerList();
    },
    handleOkUpdata() {
      if (!this.objWrite.name) {
        this.$message.warning('请输入设备名称！')
        return
      }
      if (!this.objWrite.areaId) {
        this.$message.warning('请选择区域！')
        return
      }
      if (!this.objWrite.buildId) {
        this.$message.warning('请选择楼栋！')
        return
      }
      if (!this.objWrite.door) {
        this.$message.warning('请输入门号！')
        return
      }
      if (this.objWrite.door.length > 1) {
        this.$message.warning('门号不能大于9！')
        return
      }
      // if (!this.objWrite.machine) {
      //   this.$message.warning('请输入机位！')
      //   return
      // }
      if (!this.objWrite.account) {
        this.$message.warning('请输入账号！')
        return
      }
      if (!this.objWrite.password) {
        this.$message.warning('请输入密码！')
        return
      }
      if (!this.objWrite.ip) {
        this.$message.warning('请输入ip！')
        return
      }
      if (!this.objWrite.port) {
        this.$message.warning('请输入端口号！')
        return
      }
      this.visibleWrite = false;
      const { writeDate, objWrite, $message } = this;
      const startDate = new Date(writeDate[0]);
      const endDate = new Date(writeDate[1]);
      objWrite.guarenteenStart = `${startDate.getFullYear()}-${startDate.getMonth() +
        1}-${startDate.getDate()}`;
      objWrite.guarenteenEnd = `${endDate.getFullYear()}-${endDate.getMonth() +
        1}-${endDate.getDate()}`;
      delete objWrite["areaName"];
      delete objWrite["buildName"];
      updateCameraByPrimaryKey(objWrite).then(({ data: { code, msg } }) => {
        $message.success(msg);
        if (code === 0) {
          this.getCamerList();
        }
      });
    }
  },
  created() {
    this.gatAreaList();
    this.getCamerList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.srarch span {
  display: inline-block;
  width: 50px;
  text-align: right;
}
</style>
