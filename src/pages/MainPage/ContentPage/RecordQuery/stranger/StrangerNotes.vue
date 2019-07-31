<template>
  <div class="VistorNotes">
    <Title title="陌生人记录"/>
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <!-- <div class="btn-box">
          <a-input-search
            placeholder="被访人姓名/学号"
            v-model="val"
            @search="handleSearchVistorNotes"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="VistorExport" v-if="roleDataObj.isExp">导出</a-button>
        </div> -->
        <div class="btn-box" @click="visibleVistorSearch = !visibleVistorSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="DataSource"
        :pagination="false"
        rowKey="id"
      />
    </a-spin>
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
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleVistorSearch"
      @cancel="clearSearch"
      @ok="handleSearchBreak"
      okText="筛选"
      class="modal-box">
      <div class="input-box">
        <span>所属区域:</span>
        <a-select v-model="areaId" @change="handleChangeArea(areaId)" class="input-select">
          <a-select-option v-for="item in areaList" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>所属楼栋:</span>
        <a-select v-model="buildId" class="input-select">
          <a-select-option v-for="item in buildIdList" :key="item.id">{{item.buildName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>提交时间:</span>
        <a-range-picker
          format="YYYY-MM-DD"
          v-model="timer"
          @change="changeTime"
          class="input-box-item breakDataPicker ml11-picker"
        />
      </div>
      <div class="input-box">
        <a-button block @click="clearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseUrl } from "@/baseUrl"
import req from "@/req/req";
import { roleControlBtnMixin } from "@/mixin"
const { strangerList, selectAreaList, selectBuildList } = req
export default {
  name: "stranger",
  mixins: [roleControlBtnMixin],
  data () {
    return {
      visibleVistorSearch: false,
      timer: [],
      buildIdList: [],
      areaList: [],
      areaId: '',
      startTime: '',
      buildId: '',
      endTime: '',
      DataSource: [],
      spinning: false,
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      selectedRowKeys: [],
      columns: [
        {
          title: "头像",
          customRender: (text, row, index) => {
            return <img class="img-header" src={row.picth} />
          }
        },
        {
          title: "识别位置",
          customRender: (text, row, index) => {
            return (row.areaName + '-' + row.buildName) || '无'
          }
        },
        {
          title: "识别时间",
          dataIndex: "createTime"
        }
      ]
    }
  },
  created() {
    this.gatAreaList(); //查询区域列表
    this.getStrangerList()
  },
  methods: {
    getStrangerList () {
      strangerList({
        pageNum: this.pageinfo.pageNum,
        pageSize: this.pageinfo.pageSize,
        startDate: this.startTime,
        endDate: this.endTime,
        buildId: this.buildId,
        areaId: this.areaId
      }).then(({data: {data, code, msg}}) => {
        this.DataSource = data.content
        if (data && data.pageinfo) {
          this.pageinfo = data.pageinfo
        }
      })
    },
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    handleChangeArea (id) {
      this.buildId = "";
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.buildIdList = data
        }
      });
    },
    changePage (page, pageSize) {
      this.pageinfo.pageNum = page
      this.getStrangerList()
    },
    changeSize (page, pageSize) {
      this.pageinfo.pageSize = pageSize
      this.pageinfo.pageNum = 1
      this.getStrangerList()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    clearSearch () {
      this.areaId = ''
      this.buildId = ''
      this.timer = []
      this.endTime = ''
      this.startTime = ''
    },
    changeTime (time) {
      this.startTime = time[0].format("YYYY-MM-DD");
      this.endTime = time[1].format("YYYY-MM-DD");
    },
    handleSearchBreak () {
      this.getStrangerList()
      this.visibleVistorSearch = false
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
