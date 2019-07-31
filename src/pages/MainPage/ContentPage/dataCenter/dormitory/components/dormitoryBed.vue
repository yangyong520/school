<template>
  <div class="dormitoryBed">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button
            class="btn-item"
            @click="visibleBedAdd = !visibleBedAdd"
            v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box" v-if="roleDataObj.isDel">
          <a-button class="btn-item" @click="dleList">批量删除</a-button>
        </div>
        <div class="btn-box" v-if="roleDataObj.isTuiq">
          <a-button class="btn-item" @click="AllshowConfirm">批量退寝</a-button>
        </div>
        <div class="btn-box" v-if="roleDataObj.isChangwfp">
          <a-button
            class="btn-item"
            :disabled="disabled"
            @click="distribution">床位分配</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="学号/姓名"
            v-model="valSearch"
            @search="searchBtn"
            maxlength="20"
            onkeyup="this.value=this.value.replace(/\s+/g,'')"
            enterButton
          />
        </div>
        <div class="btn-box" @click="visible = !visible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="bed" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!-- 筛选 -->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visible"
      @cancel="resetSearch"
      @ok="searchSelectBtn"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>区域:</span>
        <area-select
          :value="areaIdSearch"
          :haveAll="true"
          size="default"
          @changeVal="(val)=>{this.areaIdSearch = val}"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>楼栋:</span>
        <build-select
          :value="buildIdSearch"
          :haveAll="true"
          size="default"
          @changeVal="val=>{this.buildIdSearch = val}"
          @getObj="obj=>{this.buildObjSearch = obj}"
          :areaId="areaIdSearch"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>楼层:</span>
        <a-select
          v-model="floorNumSearch"
          :dropdownStyle="{zIndex: 10002}"
          size="default"
          class="input-select"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item"
            v-for="item in buildObjSearch.floor"
            :key="item + '-floor1'"
          >{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>空置:</span>
        <a-select v-model="statusSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="0">空置</a-select-option>
          <a-select-option value="1">有人住</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
    <!--添加-->
    <a-modal
      :maskClosable="false"
      title="新增"
      v-model="visibleBedAdd"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      @ok="addHandleOkBen"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属区域:</span>
        <area-select
          :value="areaIdAdd"
          @changeVal="(val)=>{this.areaIdAdd = val}"
          class="input-select"
          size="default"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属楼栋:</span>
        <build-select
          :value="buildIdAdd"
          @changeVal="val=>{this.buildIdAdd = val}"
          @getObj="obj=>{this.buildObj = obj}"
          :areaId="areaIdAdd"
          class="input-select"
          size="default"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属楼层:</span>
        <a-select
          v-model="floorNum"
          :dropdownStyle="{zIndex: 10002}"
          size="default"
          class="input-select">
          <a-select-option
            :value="item"
            v-for="(item) in buildObj.floor"
            :key="item + '-floor2'"
          >{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">房间号:</span>
        <room-select
          :value="roomIdAdd"
          @changeVal="val=>{this.roomIdAdd = val}"
          @getObj="obj=>{this.roomObj = obj}"
          :floorNum="floorNum"
          :buildId="buildIdAdd"
          :dropdownStyle="{zIndex: 10002}"
          size="default"
          class="input-select"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">添加床位数:</span>
        <a-input-number
          size="default"
          class="input-select boxBanModalInput"
          placeholder="请输入床位数"
          v-model="amount"
          :min="1"
          :max="bedLimt.max - roomObj.bedNumber"
          :step="1"
        />
      </div>
      <div class="clearfix"></div>
      <p>
        <span>当前床位数：{{roomObj.bedNumber || 0}}，最大床位数：{{bedLimt.max}}</span>
      </p>
    </a-modal>
    <!--调寝-->
    <a-modal
      title="调寝"
      :maskClosable="false"
      v-model="visibleBedDo"
      @ok="changeDormBedRoom"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv">
        <span class="boxBanModalSpan">所属区域:</span>
        <area-select
          :value="areaIdChange"
          size="default"
          @changeVal="(val)=>{this.areaIdChange = val}"
          class="input-select"
        />
      </div>
      <div class="input-box boxDiv">
        <span class="boxBanModalSpan">所属楼栋:</span>
        <build-select
          :value="buildIdChange"
          @changeVal="val=>{this.buildIdChange = val}"
          @getObj="obj=>{this.buildObjChange = obj}"
          :areaId="areaIdChange"
          size="default"
          class="input-select"
        />
      </div>
      <div class="input-box boxDiv">
        <span class="boxBanModalSpan">所属楼层:</span>
        <a-select v-model="floorNum" :haveAll="false" size="default" class="input-select">
          <!-- <a-select-option value="all">全部</a-select-option> -->
          <a-select-option
            :value="item"
            v-for="(item) in buildObjChange.floor"
            :key="item + '-floor3'"
          >{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv">
        <span class="boxBanModalSpan">所属房间:</span>
        <room-select
          :value="roomIdChange"
          :haveAll="false"
          @changeVal="val=>{this.roomIdChange = val}"
          :floorNum="floorNumGet"
          :buildId="buildIdChange"
          size="default"
          class="input-select"
        />
      </div>
      <div class="input-box boxDiv">
        <span class="boxBanModalSpan">所属床位:</span>
        <BedSelect
          :value="bedIdChange"
          @changeVal="val=>{this.bedIdChange = val}"
          :roomId="roomIdChange"
          size="default"
          class="input-select"
        />
      </div>
      <div class="clearfix"></div>
      <div class="border_eeeMtB10"></div>
      <div class="input-box">
        <span v-if="stuentData.studentName">
          原居住人：{{stuentData.studentName ? stuentData.studentName : '无' }}
          {{`${stuentData.collegeName ? stuentData.collegeName : '无' }-
          ${stuentData.proName ? stuentData.proName : '无' }-
          20${stuentData.gradeName ? stuentData.gradeName + '级-' : '' }
          ${stuentData.className ? stuentData.className + '班' : '' }`}}
        </span>
        <span v-else>原居住人：无</span>
      </div>
      <div class="clearfix"></div>
      <div class="input-box">
        <span v-if="stuentData.teacherName">辅导员：{{stuentData.teacherName}} {{stuentData.teacherPhone}}</span>
        <span v-else>辅导员：无</span>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--编辑-->
    <a-modal
      title="编辑"
      :maskClosable="false"
      v-model="visibleBedSet"
      @ok="handleOkUpdata"
      okText="确定"
      class="modal-box">
      <div class="input-box boxDiv" style="width: 70% !important;">
        <span>床位号:&nbsp;&nbsp;</span>
        <a-input-number
          size="small"
          class="input-box-item boxBanModalInput"
          :style="{width: '100px'}"
          :max="bedLimt.max"
          :min="bedLimt.min"
          v-model="upDataObj.bedName"
          :placeholder="`1~${bedLimt.max}`"
        />
        <span>&nbsp;&nbsp;&nbsp;床位号</span>
      </div>
      <div class="clearfix"></div>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import req from "@/req/req";
import { mapState } from "vuex";
const {
  selectBuildList,
  selectAreaList,
  selectRoomList,
  insertBed, // 添加床位信息
  deleteButchBed, // 批量删除床位信息
  deleteBedByPrimaryKey, // 添加床位信息
  updateBedByPrimaryKey, // 修改床位信息
  selectBedList, // 查询床位信息列表
  LayBackBed, // 退寝
  changeDorm, // 调寝
  selectStudentByBedId // 获取
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "dormitoryBed",
  components: {
    DataTable
  },
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "床位管理",
      disabledAdd: false,
      ids: [],
      visible: false, // 塞选弹窗
      visibleBedAdd: false, // 弹窗
      visibleBedSet: false, // 弹窗
      visibleBedDo: false, // 弹窗
      columns: [
        {
          title: "所属区域",
          dataIndex: "areaName"
        },
        {
          title: "所属楼栋",
          dataIndex: "buildName"
        },
        {
          title: "房间号",
          dataIndex: "roomName"
        },
        {
          title: "床位号",
          dataIndex: "bedName"
        },
        {
          title: "入住情况",
          customRender: (text, record, index) => {
            if (record.status === 0) {
              return '空置'
            }
            if (record.status === 1) {
              let name = record.userName ? record.userName: ''
              let num = record.userNum ? record.userNum : ''
              return `${name}  ${num}`
            }
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
                      this.upDataObj = { ...record, bedName: record.bedName };
                      this.visibleBedSet = !this.visibleBedSet;
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
                  <span style="display: none;" />
                )}
                {record.status !== 0 && this.roleDataObj.isTiaoq ? (
                  <span
                    onClick={() => {
                      this.changeObjSend = record;
                      this.visibleBedDo = !this.visibleBedDo;
                    }}
                  >
                    调寝
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
                {record.status !== 0 && this.roleDataObj.isTuiq ? (
                  <span
                    onClick={() => {
                      this.ids = [];
                      this.ids.push(record.id);
                      this.showConfirm();
                    }}
                  >
                    退寝
                  </span>
                ) : (
                  ''
                )}
              </div>
            );
          }
        }
      ],
      upDataObj: {
        id: null,
        bedName: 0
      },
      selectedRowKeys: [],
      areaIdAdd: null,
      buildListArr: [],
      buildIdAdd: null,
      roomListArr: [],
      roomIdAdd: null,
      floorNum: null,
      spinning: false,
      amount: "",
      buildObj: {},
      roomObj: {},
      areaIdSearch: "all",
      buildIdSearch: "all",
      buildObjSearch: {},
      floorNumSearch: "all",
      statusSearch: "all",
      valSearch: null,
      areaIdChange: "", // 调寝区域
      buildIdChange: "", // 调寝楼栋
      buildObjChange: {}, // 调寝楼栋对象
      floorNum: null, // 调寝楼层
      roomIdChange: "", // 调寝房间
      bedIdChange: "", // 调寝床位
      stuentData: {}, // 被调寝学生信息
      changeObjSend: {} // 调寝学生信息
    };
  },
  computed: {
    disabled() {
      const len = this.selectedRowKeys.length;
      if (len > 0) {
        return true;
      }
      return false;
    },
    getFloorNum() {
      const { buildListArr } = this;
      let num = 0;
      buildListArr.forEach(ele => {
        if (ele.id === this.buildIdAdd) {
          num = ele.floor;
        }
      });
      return num;
    },
    floorNumGet() {
      if (this.floorNum === "all") {
        return null;
      }
      return this.floorNum;
    },
    queryObj () {
      return {
        buildId: this.buildIdSearch === "all" ? null : this.buildIdSearch,
        areaId: this.areaIdSearch === "all" ? null : this.areaIdSearch,
        floor: this.floorNumSearch === "all" ? null : this.floorNumSearch,
        status: this.statusSearch === "all" ? null : this.statusSearch,
        val: this.valSearch
      }
    },
    ...mapState("limt", ["bedLimt", "roomLimt", "floorLimt"])
  },
  methods: {
    handleOk(e) {
      this.visible = false;
    },
    //批量退寝
    AllshowConfirm() {
      const { selectedRowKeys, $message } = this;
      if (selectedRowKeys.length === 0) {
        this.$message.warning("请先选择目标！");
        return;
      }
      var id = selectedRowKeys;
      this.$confirm({
        title: "提示",
        content: "确定后，系统将对原住宿人员作退寝处理，是否确定?",
        onOk: () => {
          LayBackBed(id).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    // 退寝
    showConfirm() {
      const { ids, $message } = this;
      var id = ids
      this.$confirm({
        title: "提示",
        content: "确定后，系统将对原住宿人员作退寝处理，是否确定?",
        onOk: () => {
          LayBackBed(id).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.$refs.table_page.refresh()
            } else {
              $message.error(msg);
            }
          })
        }
      });
    },
    // 分配
    distribution () {
      this.$router.push("/mainPage/dormitoryBedDetails");
    },
    searchBtn () {
      this.getBedList()
    },
    addHandleOkBen () {
      if (!this.areaIdAdd) {
        this.$message.warning("请选择所属区域");
        return;
      }
      if (!this.buildIdAdd) {
        this.$message.warning("请选择所属楼栋");
        return;
      }
      if (!this.floorNum) {
        this.$message.warning("请选择所属楼层");
        return;
      }
      if (!this.roomIdAdd) {
        this.$message.warning("请选择房间号");
        return;
      }
      if (!this.amount) {
        this.$message.warning("请输入添加床位数");
        return;
      }
      this.disabledAdd = true
      insertBed({
        areaId: this.areaIdAdd,
        buildId: this.buildIdAdd,
        floor: this.floorNum,
        amount: this.amount,
        roomId: this.roomIdAdd
      }).then(({ data: { code, msg } }) => {
        this.visibleRoom = false;
        if (code === 0) {
          this.amount = "";
          this.$message.success(msg);
          this.visibleBedAdd = false;
          this.$refs.table_page.refresh()
        } else {
          this.$message.warning(msg);
        }
        this.disabledAdd = false
      });
    },
    getBuildList (areaId) {
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArr = data;
        }
      });
    },
    getRoomList () {
      const { floorNum, buildIdAdd } = this;
      selectRoomList({
        buildId: buildIdAdd,
        floor: floorNum
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.roomListArr = data;
        }
      });
    },
    handleChangeArea() {
      const { areaIdAdd } = this;
      this.buildIdAdd = null;
      this.getBuildList(areaIdAdd)
    },
    getBedList () {
      // 获取区域列表
      this.$refs.table_page.getDataTable()
    },
    resetSearch() {
      this.buildIdSearch = "all";
      this.areaIdSearch = "all";
      this.floorNumSearch = "all";
      this.statusSearch = "all";
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteBedByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.$refs.table_page.refresh()
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
          deleteButchBed({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              $message.success(msg);
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
            } else {
              $message.error(msg);
            }
          });
        },
        onCancel() {}
      });
    },
    searchSelectBtn() {
      this.visible = false;
      this.getBedList();
    },
    handleOkUpdata() {
      const { upDataObj, $message } = this;
      updateBedByPrimaryKey({
        id: upDataObj.id,
        bedNum: upDataObj.bedName
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.visibleBedSet = false;
          this.$refs.table_page.refresh()
        } else {
          $message.warning(msg);
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getStuentData(val) {
      if (!val) {
        this.stuentData = {};
        return;
      }
      selectStudentByBedId({ bedId: val }).then(
        ({ data: { code, msg, data = {} } }) => {
          const { $message } = this;
          if (code === 0) {
            this.stuentData = data;
          } else {
            $message.warning(msg);
          }
        }
      );
    },
    changeDormBedRoom () {
      if (!this.areaIdChange) {
        this.$message.warning('请选择调寝区域！')
        return
      }
      if (!this.buildIdChange) {
        this.$message.warning('请选择调寝楼栋！')
        return
      }
      if (!this.roomIdChange) {
        this.$message.warning('请选择调寝房间！')
        return
      }
      if (!this.bedIdChange) {
        this.$message.warning('请选择床位！')
        return
      }
      const {
        changeObjSend: { id, userId },
        areaIdChange,
        buildIdChange,
        roomIdChange,
        bedIdChange,
        stuentData
      } = this;
      changeDorm({
        id,
        changeUserId: userId,
        changeAreaId: areaIdChange,
        changeBuildId: buildIdChange,
        changeRoomId: roomIdChange,
        changeBedId: bedIdChange
      }).then(({ data: { code, msg } }) => {
        const { $message } = this;
        if (code === 0) {
          $message.success(msg);
          this.areaIdChange = ''
          this.buildIdChange = ''
          this.roomIdChange = ''
          this.bedIdChange = ''
          this.stuentData = {}
          this.visibleBedDo = false;
          this.$refs.table_page.refresh()
        } else {
          $message.warning(msg);
        }
      });
    }
  },
  watch: {
    bedIdChange(newVal) {
      this.getStuentData(newVal);
    },
    buildIdAdd() {
      this.floorNum = null;
    },
    areaIdAdd() {
      this.buildIdAdd = "";
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
