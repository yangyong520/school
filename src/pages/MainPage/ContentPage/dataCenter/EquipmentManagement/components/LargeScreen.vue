<template>
  <div class="LargeScreen">
    <div class="inner-style">
      <div class="box-left">
        <!-- <div class="btn-box">
          <a-button class="btn-item" @click="visible = !visible" v-if="roleDataObj.isAdd">新增</a-button>
        </div> -->
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
        :dataSource="screenListData"
        :pagination="false"
        @change="changePage"
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
      v-model="visible"
      @ok="handleOkAdd"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      okText="确定"
      class="modal-box">
      <div class="input-box xinhao">
        <span class="boxSpanInput">设备名称:</span>
        <a-input size="small" style="width: 250px" class="boxInput" v-model="name" placeholder="请输入设备名称"/>
      </div>
      <div class="input-box">
        <span class="boxSpanInput">保修时间:</span>
        <a-range-picker style="width: 250px" @change="getDate" format="YYYY-MM-DD" class="boxInput"/>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在位置:</span>
        <div class="boxInput" style="display: flex;width: 250px">
          <a-select
            placeholder="请先选择区域"
            class="input-select"
            v-model="areaIdAdd"
            style="width: 100px"
            @change="handleChangeArea">
            <a-select-option
              v-for="(item) in areaListArr"
              :key="item.id"
              :value="item.id"
            >{{item.areaName}}</a-select-option>
          </a-select>
          <a-select
            v-model="buildIdAdd"
            placeholder="请先选择楼栋"
            style="flex: 1;margin-left: 5px;width: 100px"
            class="input-select">
            <a-select-option
              :value="item.id"
              v-for="(item) in buildListArr"
              :key="item.id + '-build'"
            >{{item.buildName}}</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-box" style="justify-content: flex-end;">
        <div class="input-box-item boxInput" style="display: flex;width: 246px">
          <a-input
            size="small"
            class="input-box-item boxInput"
            style="flex: 1;"
            placeholder="请输入门号"
            v-model="door"/>号门
          <!-- <a-input
            size="small"
            class="input-box-item boxInput"
            style="flex: 1;margin-left: 5px"
            placeholder="请输入机号"
            v-model="machine"/>号机 -->
        </div>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">IP:</span>
        <a-input size="small" style="width: 250px" v-model="ip" class="input-box-item boxInput" placeholder="请输入IP"/>
      </div>
    </a-modal>
    <!--编辑-->
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
          style="width: 250px"
          class="input-box-item boxInput"
          v-model="objWrite.name"
          placeholder="请输入设备名称"
        />
      </div>
      <div class="input-box">
        <span class="boxSpanInput">保修时间:</span>
        <a-range-picker style="width: 250px" v-model="writeDate" format="YYYY-MM-DD" class="input-box-item boxInput"/>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">所在位置:</span>
        <div class="input-box-item boxInput" style="display: flex;width: 250px">
          <a-select
            placeholder="请先选择区域"
            class="input-select"
            style="width: 100px;"
            v-model="objWrite.areaId"
            @change="handleChangeAreaWrite">
            <a-select-option
              v-for="(item) in areaListArr"
              :key="item.id"
              :value="item.id">{{item.areaName}}</a-select-option>
          </a-select>
          <a-select
            @change="changeSelect"
            v-model="objWrite.buildId"
            placeholder="请先选择楼栋"
            style="flex: 1;margin-left: 5px;width: 100px"
            class="input-select">
            <a-select-option
              :value="item.id"
              v-for="(item) in buildListArrWrite"
              :key="item.id + '-build'"
            >{{item.buildName}}</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-box" style="justify-content: flex-end;">
        <div class="input-box-item boxInput" style="display: flex;width: 245px">
          <a-input
            size="small"
            @change="changeInput"
            class="input-box-item boxInput"
            style="flex: 1"
            placeholder="请输入门号"
            v-model="objWrite.door"
          />号门
          <!-- <a-input
            size="small"
            class="input-box-item boxInput"
            style="flex: 1;margin-left: 5px"
            placeholder="请输入机号"
            v-model="objWrite.machine"
          />号机 -->
        </div>
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">IP:</span>
        <a-input
          size="small"
          v-model="objWrite.ip"
          style="width: 250px"
          class="input-box-item boxInput"
          placeholder="请输入IP"
        />
      </div>
      <div class="input-box xinhao">
        <span class="boxSpanInput">摄像头:</span>
        <a-select
          v-model="objWrite.cameraId"
          placeholder="选择摄像头"
          class="input-box-item boxInput"
          style="width: 250px">
          <a-select-option
            :value="item.id"
            v-for="item in cameraList"
            :key="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!-- 筛选 -->
    <a-modal
      :maskClosable="false"
      title="筛选"
      v-model="visibleModal"
      @ok="getScreenList"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>状态:</span>
        <a-select defaultValue="all" v-model="statusSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option :value="0">离线</a-select-option>
          <a-select-option :value="1">在线</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>区域:</span>
        <a-select
          placeholder="请先选择区域"
          class="input-select"
          v-model="areaIdSearch"
          @change="handleChangeAreaSearch"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            v-for="(item) in areaListArr"
            :key="item.id"
            :value="item.id"
          >{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
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
      <div class="input-box">
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
  insertScreen,
  selectAreaList,
  selectBuildList,
  deleteScreenByPrimaryKey,
  deleteButchScreen,
  queryScreenList,
  getCameraList,
  updateScreenByPrimaryKey
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "LargeScreen",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      cameraList: [],
      roleName: "大屏",
      disabledAdd: false,
      msg: "Welcome to Your Vue.js App",
      visibleModal: false,
      columns: [
        {
          title: "设备名称",
          dataIndex: "name"
        },
        {
          title: "状态",
          customRender: (text, record, index) => {
            return record.status === 0 ? <span>离线</span> : <span>在线</span>;
          }
        },
        {
          title: "保修期",
          //  0：在保 1：过保 2：即将过保
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
          title: "IP",
          dataIndex: "ip"
        },
        {
          title: "软件版本号",
          dataIndex: "vension"
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
                      this.cameraRefresh()
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
      selectedRowKeys: [],

      visible: false, // 添加弹窗
      name: "",
      dateFix: [],
      ip: "",
      door: "",
      machine: "",
      areaIdAdd: null,
      buildIdAdd: null,
      buildListArr: [],
      areaListArr: [],
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      spinning: false,
      screenListData: [],
      statusSearch: "all",
      areaIdSearch: "all",
      buildIdSearch: "all",
      guarenteenStatusSearch: "all",
      buildListArrSearch: [],
      objWrite: {}, // 修改部分
      writeDate: [new Date(), new Date()],
      buildListArrWrite: [],
      visibleWrite: false
    };
  },
  methods: {
    handleChange(event) {
    },
    itemRender(current, type, originalElement) {
      return originalElement;
    },
    // 删除
    showConfirm() {
      this.$confirm({
        title: "删除",
        content: "确认要删除所选内容吗?",
        onOk: () => {},
        onCancel: () => {}
      });
    },
    // 添加
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    // 添加
    // 单项删除
    del() {
      this.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {},
        onCancel: () => {}
      });
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOkAdd() {
      if (!this.name) {
        this.$message.warning('请输入设备名称！')
        return
      }
      if (!this.areaIdAdd || !this.buildIdAdd) {
        this.$message.warning('请选择楼栋！')
        return
      }
      if (!this.door) {
        this.$message.warning('请输入门号！')
        return
      }
      // if (!this.machine) {
      //   this.$message.warning('请输入机位！')
      //   return
      // }
      if (!this.ip) {
        this.$message.warning('请输入ip！')
        return
      }
      const {
        dateFix,
        ip,
        areaIdAdd,
        buildIdAdd,
        name,
        door,
        // machine,
        $message
      } = this;
      this.disabledAdd = true
      insertScreen({
        guaranteenStart: dateFix[0],
        guaranteenEnd: dateFix[1],
        ip,
        name,
        door,
        // machine,
        areaId: areaIdAdd,
        buildId: buildIdAdd
      }).then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getScreenList();
        } else {
          $message.error(msg);
        }
        this.disabledAdd = true
        this.visible = false;
      });
    },
    getScreenList() {
      const {
        areaIdSearch,
        buildIdSearch,
        guarenteenStatusSearch,
        statusSearch,
        pageinfo: { pageSize, pageNum },
        $message
      } = this;
      this.spinning = true;
      queryScreenList({
        pageSize,
        pageNum,
        areaId: areaIdSearch === "all" ? null : areaIdSearch,
        buildId: buildIdSearch === "all" ? null : buildIdSearch,
        status: statusSearch === "all" ? null : statusSearch,
        guarenteenStatus: guarenteenStatusSearch === "all" ? null : guarenteenStatusSearch
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.screenListData = content.map(x => {
              return {
                areaId: x.areaId || '',
                areaName: x.areaName || '',
                buildId: x.buildId || '',
                buildName: x.buildName || '',
                door: x.door || '',
                guarenteenEnd: x.guarenteenEnd || new Date(),
                guarenteenStart: x.guarenteenStart || new Date(),
                guarenteenStatus: x.guarenteenStatus || 1,
                id: x.id,
                ip: x.ip || '',
                // machine: x.machine || '',
                name: x.name || '',
                status: x.status || 0,
                vension: x.vension || '',
                cameraId: x.cameraId || ''
              }
            })
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
      this.visibleModal = false
    },
    getDate(date, dateString) {
      this.dateFix = dateString;
    },
    handleChangeArea() {
      const { areaIdAdd } = this;
      this.buildIdAdd = null;
      this.roomIdAdd = null;
      this.floorNum = null;
      this.getBuildList(areaIdAdd);
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
      const { $confirm, $message, getScreenList } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteScreenByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.pageinfo.pageNum = 1;
              getScreenList();
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
          deleteButchScreen({ ids }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.pageinfo.pageNum = 1;
              this.getScreenList();
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    handleChangeAreaSearch() {
      const { areaIdSearch } = this;
      this.buildIdSearch = null;
      if (areaIdSearch === "all") {
        this.buildIdSearch = "all";
        return;
      }
      this.getBuildListSearch(areaIdSearch);
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
    resetSearch() {
      this.statusSearch = "all";
      this.guarenteenStatusSearch = "all";
      this.areaIdSearch = "all";
      this.buildIdSearch = "all";
      this.buildListArrSearch = [];
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getScreenList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getScreenList();
    },
    handleOkUpdata() {
      if (!this.objWrite.name) {
        this.$message.warning('请输入设备名称！')
        return
      }
      if (!this.objWrite.areaId || !this.objWrite.buildId) {
        this.$message.warning('请选择楼栋！')
        return
      }
      if (!this.objWrite.door) {
        this.$message.warning('请输入门号！')
        return
      }
      if (!this.objWrite.cameraId) {
        this.$message.warning('请选择摄像头！')
        return
      }
      if (!this.objWrite.ip) {
        this.$message.warning('请输入ip！')
        return
      }
      this.visibleWrite = false;
      const { writeDate, objWrite, $message } = this;
      const startDate = new Date(writeDate[0]);
      const endDate = new Date(writeDate[1]);
      objWrite.guaranteenStart = `${startDate.getFullYear()}-${startDate.getMonth() +
        1}-${startDate.getDate()}`;
      objWrite.guaranteenEnd = `${endDate.getFullYear()}-${endDate.getMonth() +
        1}-${endDate.getDate()}`;
      delete objWrite["areaName"];
      delete objWrite["buildName"];
      delete objWrite["vension"];
      delete objWrite["status"];
      delete objWrite["guarenteenStatus"];
      delete objWrite["guarenteenEnd"];
      delete objWrite["guarenteenStart"];
      updateScreenByPrimaryKey(objWrite).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.getScreenList();
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
    handleChangeAreaWrite() {
      const {
        objWrite: { areaId }
      } = this;
      this.objWrite.buildId = null;
      this.getBuildListWrite(areaId);
    },
    changeInput () {
      this.cameraRefresh()
    },
    changeSelect () {
      this.cameraRefresh()
    },
    cameraRefresh () {
      getCameraList({
        buildId: this.objWrite.buildId,
        door: this.objWrite.door
      }).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          this.cameraList = data
        } else {
          this.$message.warning(msg)
        }
      })
    }
  },
  created() {
    this.gatAreaList();
    this.getScreenList(); // 获取列表
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.input-box span {
  display: inline-block;
  width: 50px;
  text-align: center;
}
</style>
