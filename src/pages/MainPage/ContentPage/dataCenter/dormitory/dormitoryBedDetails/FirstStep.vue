<template>
  <div class="FirstStep">
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box" @click="visible = !visible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
          <a-modal
            @cancel="btnCancel"
            title="筛选"
            v-model="visible"
            @ok="handleOk"
            okText="查询"
            class="modal-box"
            :closable="false"
            :maskClosable="false">
            <div class="input-box">
              <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
              <a-select v-model="sex" class="input-select">
                <a-select-option :value="0">男</a-select-option>
                <a-select-option :value="1">女</a-select-option>
              </a-select>
            </div>
            <div class="input-box">
              <span>区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:</span>
              <area-select
                :value="areaId"
                :showDefault="true"
                size="default"
                @changeVal="(val)=>{this.areaId = val}"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;栋:</span>
              <build-select
                :value="buildId"
                :showDefault="true"
                @changeVal="val=>{this.buildId = val}"
                @getObj="obj=>{this.buildObj = obj}"
                :areaId="areaId"
                size="default"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;层:</span>
              <a-select
                v-model="floor"
                :dropdownStyle="{zIndex: 10002}"
                size="default"
                class="input-select">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option
                  :value="item"
                  v-for="(item) in buildObj.floor"
                  :key="item + '-floor2'"
                >{{item}}</a-select-option>
              </a-select>
            </div>
            <div class="input-box">
              <span>入住情况:</span>
              <a-select v-model="status" class="input-select">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option value="0">空置</a-select-option>
                <a-select-option value="1">已入住</a-select-option>
              </a-select>
            </div>
            <div class="input-box">
              <a-button block @click="resetting">重制</a-button>
            </div>
          </a-modal>
        </div>
      </div>
    </div>
    <a-table
      :scroll="{ y: 600 }"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      rowKey="id"
      :dataSource="data"
      :pagination="false"
      @change="changePage">
      <template slot="status" slot-scope="status">
        <div v-if="status.status === 0">空置</div>
        <div v-else>{{status.userName}}  {{status.userPhone}}</div>
      </template>
    </a-table>
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
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import Vue from "vue"
import req from "@/req/req"

const {
  queryAssignDormList
} = req
export default {
  name: "FirstStep",
  data() {
    return {
      selectedRowKeys: [],
      data: [],
      visible: true,
      columns: [
        {
          width: 150,
          title: "房间号",
          dataIndex: "roomNum",
        },
        {
          width: 150,
          title: "床位号",
          dataIndex: "bedNum",
        },
        {
          width: 150,
          title: "入住情况",
          scopedSlots: { customRender: 'status' }
        }
      ],
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      sex: 0,
      areaId: "",
      buildId: "",
      buildObj: {},
      floor: "-1",
      status: '-1'
    };
  },
  mounted () {
    // this.setBed(this.selectedRowKeys)
    Vue.ls.set('bad_list', [])
  },
  methods: {
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.searchList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.searchList();
    },
    ...mapMutations('Bad', ['setBed']),
    onSelectChange (selectedRowKeys) {
      Vue.ls.set('bad_list', [])
      this.selectedRowKeys = selectedRowKeys
      Vue.ls.set('bad_list', this.selectedRowKeys)
      Vue.ls.set('peo_sex', this.sex)
    },
    resetting () {
      this.sex = 0
      this.areaId = ''
      this.buildId = ''
      this.buildObj = {}
      this.floor = '-1'
      this.status = '-1'
    },
    handleOk() {
      if (this.areaId && this.buildId && this.floor && this.status) {
        this.visible = false
        this.searchList()
        return false
      } else {
        this.$message.warning("请先完善筛选条件！")
      }
    },
    searchList () {
      queryAssignDormList({
        areaId: this.areaId,
        buildId: this.buildId,
        status: this.status === '-1' ? '' : this.status,
        floor: this.floor === '-1' ? '' : this.floor,
        sex: this.sex,
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
      }).then(({data: {code, msg, data}}) => {
        this.data = data.content
      })
    },
    btnCancel() {
      const { $router } = this;
      $router.push("/mainPage/dormitory/3");
    },
  },
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>

