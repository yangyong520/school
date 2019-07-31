<template>
  <div class="SyncLog">
    <!--头部-->
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-range-picker
            format="YYYY-MM-DD"
            v-model="LeaveDate"
            class="input-box-item breakDataPicker vistorTime"
          />
        </div>
        <div class="btn-box">
          <a-button type="primary" @click="searchSyncLog">查询</a-button>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :showRowSelection="false" :columns="columns" reqType="sync" :queryObj="queryObj"></DataTable>
  </div>
</template>

<script>
import req from "@/req/req";
const {
  reSend
  //queryVisitorInOutList,//获取同步日志列表   ---------假的
} = req;
import { roleControlBtnMixin } from "@/mixin";
import DataTable from '@/components/DataTable'
export default {
  name: "SyncLog",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      LeaveDate: [], //查询时间数组
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      columns: [
        {
          title: "标题",
          dataIndex: "type"
        },
        {
          title: "设备名称",
          dataIndex: "redeyeName"
        },
        {
          title: "发送状态",
          dataIndex: "inOrOut",
          customRender: (text, row, index) => {
            if (row.inOrOut) {
              return row.inOrOut === 1 ? '发' : '收'
            }
            return '暂无状态'
          }
        },
        // {
        //   title: "发送提示",
        //   dataIndex: "sendMsg"
        // },
        {
          title: "接收状态",
          dataIndex: "status",
          customRender: (text, row, index) => {
            if (row.inOrOut) {
              if (row.inOrOut) {
                return {
                  '1': row.status === 1 ? '发送成功' : '发送失败',
                  '2': row.status === 1 ? '接收成功' : '接收失败',
                }[row.inOrOut]
              }
            }
          }
        },
        // {
        //   title: "接收提示",
        //   dataIndex: "receiveMsg"
        // },
        {
          title: "时间",
          dataIndex: "createTime"
        },
        {
          title: "备注",
          // dataIndex: "errorMsg"
          customRender: (text, row, index) => {
            if (row.errorMsg) {
              return row.errorMsg
            } else {
              return '无'
            }
          }
        },
        {
          title: '设置',
          dataIndex: "action",
          customRender: (text, record, index) => {
            if (record.status === -1) {
              return <div class="todo-box"><span onClick={() => this.resend(record.id)}>重发</span></div>
            } else {
              return ''
            }
          }
        }
      ]
    };
  },
  computed: {
    queryObj () {
      return {
        pageSize: 10,
        pageNum: 1,
        startDate: this.startTime,
        endDate: this.endTime
      }
    }
  },
  methods: {
    resend (id) {
      reSend({
        id: id
      }).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          this.$message.success(msg)
          this.$refs.table_page.refresh()
        } else {
          this.$message.warning(msg)
        }
      })
    },
    //查询
    searchSyncLog () {
      if (this.LeaveDate[0]) {
        this.startTime = this.LeaveDate[0].format("YYYY-MM-DD")
        this.endTime = this.LeaveDate[1].format("YYYY-MM-DD")
      }
      this.$refs.table_page.getDataTable()
    }
  }
};
</script>
