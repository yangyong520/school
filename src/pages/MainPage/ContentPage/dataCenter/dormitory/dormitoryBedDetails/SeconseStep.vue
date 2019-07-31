<template>
  <div class="SeconseStep">
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
            <div slot="888">999</div>
            <div class="input-box">
              <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院：</span>
              <college-select
                :showDefault="true"
                :value="collegeId"
                @changeVal="(val)=>{this.collegeId = val}"
                size="default"
                :width="''"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>专&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业：</span>
              <profession-select
                :value="proId"
                :haveAll="true"
                @changeVal="(val)=>{this.proId = val}"
                :collegeId="collegeId"
                size="default"
                :width="''"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</span>
              <grade-select
                :showDefault="true"
                :value="gradeId"
                @changeVal="(val)=>{this.gradeId = val}"
                size="default"
                :width="''"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;級：</span>
              <class-select
                :haveAll="true"
                :value="classId"
                :gradeId="gradeId"
                :professionId="proId"
                size="default"
                :width="''"
                @changeVal="(val)=>{this.classId = val}"
                class="input-select"
              />
            </div>
            <div class="input-box">
              <span>入住情況：</span>
              <a-select v-model="assignStatus" class="input-select">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option value="0">未入住</a-select-option>
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
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="data"
      rowKey="id"
      :pagination="false"
      @change="changePage">
        <template slot="assignStatus" slot-scope="assignStatus">
          <div v-if="assignStatus.assignStatus === 0">空置</div>
          <div v-else>{{assignStatus.areaName}}-{{assignStatus.buildName}}-{{assignStatus.bedNum}}</div>
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
import Vue from "vue"
import req from "@/req/req"

const {
  queryAssignStudentList
} = req
export default {
  name: "SeconseStep",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      selectedRowKeys: [],
      data: [],
      visible: true,
      columns: [
        {
          title: "姓名",
          dataIndex: "name"
        },
        {
          title: "学号",
          dataIndex: "userNum"
        },
        {
          title: "入住状态",
          // dataIndex: "assignStatus",
          scopedSlots: { customRender: 'assignStatus' }
        }
      ],
      pageinfo: {
        // 分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      collegeId: "",
      proId: "",
      gradeId: "",
      classId: "",
      assignStatus: '0'
    };
  },
  mounted() {
    Vue.ls.set('peo_list', [])
  },
  methods: {
    resetting () {
      this.collegeId = ''
      this.proId = ''
      this.gradeId = ''
      this.classId = ''
      this.assignStatus = '0'
    },
    onSelectChange(selectedRowKeys) {
      Vue.ls.set('peo_list', [])
      this.selectedRowKeys = selectedRowKeys
      Vue.ls.set('peo_list', this.selectedRowKeys)
    },
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.searchList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.searchList();
    },
    handleOk(e) {
      if (this.collegeId && this.proId && this.gradeId && this.classId && this.assignStatus) {
        this.searchList()
        return
      }
      this.$message.warning('请先完善筛选条件！')
    },
    searchList () {
      const sex = Vue.ls.get('peo_sex')
      queryAssignStudentList({
        collegeId: this.collegeId,
        proId: this.proId === 'all' ? '' : this.proId,
        gradeId: this.gradeId,
        classId: this.classId === 'all' ? '' : this.classId,
        assignStatus: this.assignStatus === '-1' ? '' : this.assignStatus,
        sex: sex,
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
      }).then(({data: {data, code, msg}}) => {
        this.data = data.content
        this.visible = false
      })
    },
    btnCancel() {
      const { $router } = this;
      $router.push("/mainPage/dormitoryBedDetails/FirstStep");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
