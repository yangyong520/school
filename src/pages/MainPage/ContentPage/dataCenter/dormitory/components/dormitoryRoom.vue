<template>
  <div class="dormitoryRoom">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="visibleRoom = !visibleRoom" v-if="roleDataObj.isAdd">新增</a-button>
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
    <DataTable ref="table_page" :columns="columns" reqType="room" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--筛选-->
    <a-modal title="筛选" :maskClosable="false" @cancel="clearSelect" v-model="visible" @ok="searchRoomList" okText="查询" class="modal-box">
      <div class="input-box">
        <span>区域:</span>
        <a-select class="input-select" v-model="areaIdSearch" @change="handleChangeAreaSearch">
          <a-select-option v-for="(item) in areaListArr" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>楼栋:</span>
        <a-select v-model="buildIdSearch" @change="changeFoolr" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="(item) in buildListArr"
            :key="item.id + 'build'"
          >{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>楼层:</span>
        <a-select v-model="floorNumSearch" class="input-select">
          <a-select-option
            :value="item"
            v-for="(item) in getFloorNumSearch"
            :key="item + 'floor'"
          >{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>空置:</span>
        <a-select v-model="nonNumSearch" class="input-select">
          <a-select-option value>全部</a-select-option>
          <a-select-option :value="0">空置</a-select-option>
          <a-select-option :value="1">非空置</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="clearSelect">重置</a-button>
      </div>
    </a-modal>
    <!--筛选-->
    <!--添加-->
    <a-modal
      :maskClosable="false"
      title="新增"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      v-model="visibleRoom"
      @ok="addHandleOkBen"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属区域:</span>
        <a-select class="input-select" style="width: 147px" v-model="areaIdAdd" @change="handleChangeArea">
          <a-select-option v-for="(item) in areaListArr" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属楼栋:</span>
        <a-select v-model="buildIdAdd" @change="changeFoolr" style="width: 147px" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="(item) in buildListArr"
            :key="item.id + 'build'"
          >{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属楼层:</span>
        <a-select style="width: 147px" v-model="floorNum" class="input-select">
          <a-select-option
            :value="item"
            v-for="(item) in getFloorNumSearch"
            :key="item + 'floor'"
          >{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao h_32px">
        <span class="boxBanModalSpan">房间号:</span>
        <a-input-number
          size="small"
          style="width: 147px"
          v-model="roomNum"
          :min="1"
          :max="99"
          class="input-select boxBanModalInput"
          placeholder="请输入房间号"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">床位数:</span>
        <a-input-number
          size="small"
          style="width: 147px"
          v-model="bedNumber"
          class="input-select boxBanModalInput"
          placeholder="请输入床位数"
          :min="1"
          :max="20"
          :step="1"
        />
      </div>
      <div class="clearfix"></div>
      <p class="boxBanModalWarning">
        *房间数据输入完成后，若减少“床位数”，系统将对原住宿人员作
        <span>退寝处理</span>，请谨慎操作
      </p>
    </a-modal>
    <!--添加-->
    <!--编辑-->
    <a-modal
      title="编辑"
      :maskClosable="false"
      v-model="visibleRoomSet"
      @ok="addHandleOkUpdata"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv h_32px">
        <span class="boxBanModalSpan">所属区域:</span> &nbsp;&nbsp;
        <p>{{bedObj.areaName}}</p>
      </div>
      <div class="input-box boxDiv h_32px">
        <span class="boxBanModalSpan">所属楼栋:</span> &nbsp;&nbsp;
        <p>{{bedObj.buildName}}</p>
      </div>
      <div class="input-box boxDiv h_32px">
        <span class="boxBanModalSpan">所属楼层:</span> &nbsp;&nbsp;
        <p>{{bedObj.floor}}层</p>
      </div>
      <div class="input-box boxDiv h_32px">
        <span class="boxBanModalSpan">房间号:</span> &nbsp;&nbsp;
        <p>{{bedObj.roomNum}}</p>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">床位数:</span>
        <a-input-number
          size="small"
          :min="1"
          :max="20"
          class="input-box-item boxBanModalInput"
          v-model="bedObj.bedNumber"
          placeholder="请输入床位数"
        />
      </div>
      <div class="clearfix"></div>
      <p class="boxBanModalWarning">
        *房间数据输入完成后，若减少“床位数”，系统将对原住宿人员作
        <span>退寝处理</span>，请谨慎操作
      </p>
    </a-modal>
    <!--编辑-->
  </div>
</template>

<script>
import req from "@/req/req";
import { mapState } from "vuex";
import DataTable from '@/components/DataTable'
const {
  selectAreaList, // 查询区域信息列表 全部
  selectBuildList, // 查询楼栋信息列表 全部
  insertRoom, // 添加宿舍信息
  deleteButchRoom, // 批量删除宿舍信息
  getFoolr,
  deleteRoomByPrimaryKey, // 主键删除宿舍信息
  updateRoomByPrimaryKey // 修改宿舍信息
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "dormitoryRoom",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "房间管理",
      disabledAdd: false,
      visible: false, // 塞选弹窗
      visibleRoom: false, // 弹窗
      visibleRoomSet: false, // 弹窗
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
          title: "所属楼层",
          dataIndex: "floor"
        },
        {
          title: "房间号",
          dataIndex: "roomNum"
        },
        {
          title: "床位数",
          dataIndex: "bedNumber"
        },
        {
          title: "空置数",
          dataIndex: "nullNumber"
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
                      this.bedObj = record;
                      this.visibleRoomSet = !this.visibleRoomSet;
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
      ],
      areaListArr: [],
      buildListArr: [],
      areaIdAdd: null,
      buildIdAdd: null,
      floorNum: null,
      roomNum: null,
      bedNumber: null,
      selectedRowKeys: [],
      areaIdSearch: null,
      buildIdSearch: null,
      floorNumSearch: null,
      nonNumSearch: "",
      bedObj: { bedNumber: 0 },
      getFloorNumSearch: [],
      getFloorNum: []
    };
  },
  computed: {
    queryObj () {
      return {
        floor: this.floorNumSearch,
        nonNumber: this.nonNumSearch,
        areaId: this.areaIdSearch,
        buildId: this.buildIdSearch
      }
    },
    ...mapState("limt", ["bedLimt", "roomLimt", "floorLimt"])
  },
  created() {
    this.gatAreaList()
  },
  methods: {
    changeFoolr (id) {
      this.floorNumSearch = ''
      this.floorNum = ''
      getFoolr({
        buildId: id
      }).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          this.getFloorNumSearch = data
        } else {
          this.$message.warning(msg)
        }
      })
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
          deleteButchRoom({
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
    delOne(id) {
      // 删除一个
      const { $confirm, $message } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteRoomByPrimaryKey({
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
    handleChangeArea() {
      const { areaIdAdd } = this;
      this.buildIdAdd = null;
      this.floorNum = ''
      this.getBuildList(areaIdAdd);
    },
    handleChangeAreaSearch() {
      const { areaIdSearch } = this;
      this.buildIdSearch = null;
      this.floorNumSearch = ''
      this.getBuildList(areaIdSearch);
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
    getBuildList(areaId) {
      selectBuildList({
        areaId
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildListArr = data;
        }
      });
    },
    getRoomList () {
      // 获取楼栋列表
      this.$refs.table_page.getDataTable()
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
      if (!this.roomNum) {
        this.$message.warning("请输入房间号");
        return;
      }
      if (!this.bedNumber) {
        this.$message.warning("请输入床位数");
        return;
      }
      this.disabledAdd = true
      insertRoom({
        areaId: this.areaIdAdd,
        buildId: this.buildIdAdd,
        floor: this.floorNum,
        roomNum: this.roomNum,
        bedNumber: this.bedNumber
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.roomNum = ""
          this.bedNumber = ""
          this.visibleRoom = false
          this.areaIdAdd = ''
          this.buildIdAdd = ''
          this.floorNum = ''
          this.$message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          this.$message.warning(msg);
        }
        this.disabledAdd = false
      });
    },
    searchRoomList () {
      this.visible = false;
      this.getRoomList();
    },
    clearSelect() {
      this.areaIdSearch = null;
      this.buildIdSearch = null;
      this.floorNumSearch = null;
      this.nonNumSearch = "";
    },
    addHandleOkUpdata() {
      const {
        bedObj: { id, bedNumber }
      } = this;
      updateRoomByPrimaryKey({
        id,
        bedNumber
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.$refs.table_page.refresh()
          this.visibleRoomSet = false;
        } else {
          this.$message.warning(msg);
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
