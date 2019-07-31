<template>
  <div class="dormitoryBan">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="visibleBan = !visibleBan" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="dleList" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="请输入楼栋名"
            v-model="buildNameSearch"
            @search="searchName"
            enterButton
            maxlength="20"
            onkeyup="this.value=this.value.replace(/\s+/g,'')"
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportLd" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="visible = !visible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="ban" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--添加-->
    <a-modal
      title="新增"
      v-model="visibleBan"
      @ok="addHandleOkBen"
      :okButtonProps="{ props: {disabled: disabledAdd} }"
      :maskClosable="false"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属区域:</span>
        <a-select v-model="areaId" style="width: 147px" placeholder="请选择区域" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="item in areaArr"
            :key="item.id + 'area'"
          >{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">楼栋名:</span>
        <a-input
          style="width: 147px"
          v-model="buildName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入楼栋名"
          maxlength="20"
          onkeyup="this.value=this.value.replace(/\s+/g,'')"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">入住性别:</span>
        <a-select v-model="buildSex" style="width: 147px" class="input-select">
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">楼层数:</span>
        <a-input-number
          style="width: 147px"
          size="small"
          v-model="floor"
          :min="1"
          :max="99"
          class="input-box-item boxBanModalInput"
          placeholder="请输入楼层数"
          :step="1"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">每层房间数:</span>
        <a-input-number
          size="small"
          v-model="room"
          style="width: 147px"
          class="input-select boxBanModalInput"
          placeholder="请输入每层房间数"
          :min="1"
          :max="99"
          :step="1"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">房间床位数:</span>
        <a-input-number
          size="small"
          v-model="bed"
          style="width: 147px"
          class="input-box-item boxBanModalInput"
          placeholder="请输入房间床位数"
          :min="1"
          :max="20"
          :step="1"
        />
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--编辑-->
    <a-modal
      title="编辑"
      v-model="visibleBanSet"
      @ok="handleOkBenUpdata"
      :maskClosable="false"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">所属区域:</span>
        &nbsp;&nbsp;
        <span>{{todoObj.areaName}}</span>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">楼栋名:</span>
        <a-input
          size="small"
          v-model="todoObj.buildName"
          class="input-box-item boxBanModalInput"
          placeholder="请输入楼栋名"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">入住性别:</span>
        <a-select class="input-select" v-model="todoObj.sex">
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">楼层数:</span>
        <a-input-number
          size="small"
          :min="1"
          :max="9"
          v-model="todoObj.floor"
          class="input-box-item boxBanModalInput"
          placeholder="请输入楼层数"
          :step="1"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">每层房间数:</span>
        <a-input-number
          size="small"
          v-model="todoObj.roomNum"
          class="input-box-item boxBanModalInput"
          placeholder="请输入每层房间数"
          :step="1"
          :min="1"
          :max="99"
        />
      </div>
      <div class="input-box boxDiv xinhao">
        <span class="boxBanModalSpan">房间床位数:</span>
        <a-input-number
          size="small"
          v-model="todoObj.bedNum"
          class="input-box-item boxBanModalInput"
          placeholder="请输入每层房间数"
          :step="1"
          :min="1"
          :max="10"
        />
      </div>
      <div class="clearfix"></div>
      <p class="boxBanModalWarning">
        *楼栋数据输入完成后，若减少“楼层数”、“房间数”、“床位数”、修改性 别等数值，系统将对原住宿人员作
        <span>退寝处理</span>，请谨慎操作
      </p>
    </a-modal>
    <!--筛选-->
    <a-modal title="筛选" :maskClosable="false" @cancel="resetSearch" v-model="visible" @ok="handleOkSearch" okText="查询" class="modal-box">
      <div class="input-box">
        <span>区域:</span>
        <a-select defaultValue="all" placeholder="请选择" v-model="searchArea" class="input-select">
          <a-select-option :value="'all'">全部</a-select-option>
          <a-select-option :value="item.id" v-for="item in areaArr" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>性别:</span>
        <a-select defaultValue="all" placeholder="请选择" v-model="searchSex" class="input-select">
          <a-select-option :value="'all'">全部</a-select-option>
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>空置:</span>
        <a-select defaultValue="all" placeholder="请选择" v-model="searchNull" class="input-select">
          <a-select-option :value="'all'">全部</a-select-option>
          <a-select-option :value="0">是</a-select-option>
          <a-select-option :value="1">否</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import req from "@/req/req";
import { baseUrl } from '@/baseUrl'
import DataTable from '@/components/DataTable'
const {
  selectAreaList,
  insertBuild,
  deleteButchBuild,
  queryBuildList,
  deleteBuildByPrimaryKey,
  updateBuildByPrimaryKey,
  queryExportBuildIng
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "dormitoryBan",
  components: {
    DataTable
  },
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "楼栋管理",
      disabledAdd: false,
      visibleBan: false, // 弹窗
      visibleBanSet: false, // 弹窗
      visible: false, // 塞选弹窗
      columns: [
        {
          title: "所属区域",
          dataIndex: "areaName"
        },
        {
          title: "楼栋名",
          dataIndex: "buildName"
        },
        {
          title: "宿管信息",
          customRender: (text, record, index) => {
            if (record.sgList.length > 0) {
              return record.sgList.map(x => {
                if (record.sgList.length > 1) {
                  return (
                    <span class="sg-item">{x.sgName}  {x.sgPhone}</span>
                  )
                } else {
                  return `${x.sgName} ${x.sgPhone}`
                }
              });
            } else {
              return "无";
            }
          }
        },
        {
          title: "入住性别",
          customRender: (text, record, index) => {
            return record.sex === 0 ? <span>男</span> : <span>女</span>;
          }
        },
        {
          title: "层数",
          dataIndex: "floor"
        },
        {
          title: "房间数",
          dataIndex: "roomNum"
        },
        {
          title: "床位数",
          dataIndex: "bedNum"
        },
        {
          title: "空置数",
          dataIndex: "vacancy"
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return this.roleDataObj.isDel ? (
              <div class="todo-box">
                <span style="display:none"></span>
                <span
                  onClick={() => {
                    this.delOne(record.id);
                  }}
                >
                  删除
                </span>
              </div>
            ) : (
              ''
            );
          }
        }
      ],
      selectedRowKeys: [],
      areaArr: [],
      buildSex: 0,
      buildName: "",
      areaId: "",
      floor: "",
      bed: "",
      room: "",
      searchArea: "all",
      searchSex: "all",
      searchNull: "all",
      buildNameSearch: "",
      todoObj: {
        sex: 0,
        areaName: "区域名称",
        buildName: "楼栋名称",
        floor: 0,
        roomNum: 0,
        bedNum: 0
      }
    };
  },
  computed: {
    ...mapState("limt", ["bedLimt", "roomLimt", "floorLimt"]),
    queryObj () {
      return {
        buildName: this.buildNameSearch,
        areaId: this.searchArea === "all" ? null : this.searchArea,
        buildSex: this.searchSex === "all" ? null : this.searchSex,
        status: this.searchNull === "all" ? null : this.searchNull
      }
    }
  },
  methods: {
    exportLd () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择导出数据！");
        return;
      }
      queryExportBuildIng(this.selectedRowKeys).then(
        ({ data: { data, msg, code } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/export/ExportArea?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.warning(msg);
          }
        }
      );
    },
    handleOkBenUpdata() {
      const {
        $message,
        todoObj: {
          areaId,
          id,
          sex,
          areaName,
          buildName,
          floor,
          roomNum,
          bedNum
        }
      } = this;
      updateBuildByPrimaryKey({
        id,
        buildName,
        buildSex: sex,
        floor,
        room: roomNum,
        bed: bedNum
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.visibleBanSet = false;
      });
    },
    delOne(id) {
      // 删除一个
      const { $confirm, $message } = this;
      $confirm({
        title: "提示",
        content: "是否确认删除该项？",
        onOk: () => {
          deleteBuildByPrimaryKey({ id }).then(({ data: { code, msg } }) => {
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
          deleteButchBuild({ ids }).then(({ data: { code, msg } }) => {
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
    searchName() {
      this.getBuilcList();
    },
    getBuilcList() {
      this.$refs.table_page.getDataTable()
      // 获取楼栋列表
    },
    getAreaData() {
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaArr = data;
        } else {
          this.areaArr = [{ id: "0", areaName: "请先设置区域" }];
        }
      });
    },
    addHandleOkBen (e) {
      if (!this.areaId) {
        this.$message.warning("请选择所属区域");
        return;
      }
      if (!this.buildName) {
        this.$message.warning("请输入楼栋名称");
        return;
      }
      if (!this.floor) {
        this.$message.warning("请输入楼层数");
        return;
      }
      if (!this.room) {
        this.$message.warning("请输入每层房间数");
        return;
      }
      if (!this.bed) {
        this.$message.warning("请输入房间床位数");
        return;
      }
      this.disabledAdd = true
      insertBuild({
        buildName: this.buildName,
        areaId: this.areaId,
        buildSex: this.buildSex, // 男0 女1
        floor: this.floor,
        room: this.room,
        bed: this.bed
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.buildName = ""
          this.floor = ""
          this.room = ""
          this.bed = ""
          this.areaId = ''
          this.buildSex = 0
          this.$message.success(msg)
          this.$refs.table_page.refresh()
        } else {
          this.$message.warning(msg)
        }
        this.visibleBan = false
        this.disabledAdd = false
      });
    },
    handleOkSearch(e) {
      this.getBuilcList();
      this.visible = false;
    },
    resetSearch() {
      this.searchArea = "all";
      this.searchSex = "all";
      this.searchNull = "all";
    }
  },
  created() {
    this.getAreaData();
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
