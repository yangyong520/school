<template>
  <div style="background: #fff; margin-bottom: 20px;padding: 20px 0;border-radius: 4px">
    <a-spin :spinning="spinning">
      <div class="title-box" style="text-align: left">
        <span>{{title}}</span>
        <div class="layout-flex select-time-type">
          <a-select v-model="areaId" @change="handleChangeArea(areaId)" style="width: 200px">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option v-for="item in areaList" :key="item.id" :value="item.id">{{item.areaName}}</a-select-option>
          </a-select>
          <a-select v-model="buildId" style="width: 200px" @change="getCount">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option v-for="item in buildIdList" :key="item.id" :value="item.id">{{item.buildName}}</a-select-option>
          </a-select>
          <a-date-picker style="width: 200px;margin-right: 20px;" @change="changeTime" />
        </div>
      </div>
      <div style="background: #fff" v-if="key.length > 0">
        <ChartLine style="height: 400px;" ref="ChartLine" :ySplitLine="true" :value="nowData" :xData="key"/>
      </div>
    </a-spin>
  </div>
</template>

<script>
import ChartLine from '@/components/charts/ChartLine'
import DataSet from "@antv/data-set";
import req from "@/req/req";
const {
  realTimePerCount,
  selectAreaList,
  selectBuildList,
} = req
export default {
  props: ["title", "collegeId"],
  components: {
    ChartLine
  },
  data () {
    return {
      key: [],
      nowData: [
        {
          name: '总人数',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#00C9F8'
            }
          },
          data: []
        },
        {
          name: '进',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#da251c'
            }
          },
          data: []
        },
        {
          name: '出',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#3eb94e'
            }
          },
          data: []
        }
      ],
      lineDataTr: [],
      style: { stroke: "#fff", lineWidth: 1 },
      buildIdList: [],
      areaList: [],
      areaId: 'all',
      buildId: 'all',
      spinning: false,
      timer: ''
    };
  },
  mounted () {
    this.gatAreaList()
    this.getCount()
  },
  methods: {
    getCount () {
      realTimePerCount({
        queryTime: this.timer,
        areaId: this.areaId === 'all' ? '' : this.areaId,
        buildId: this.buildId === 'all' ? '' : this.buildId
      }).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          let arr1 = []
          let arr2 = []
          let arr3 = []
          let key = []
          if (data.length > 0) {
            arr1 = data.map(x => {
              return x.tatolNumber
            })
            arr2 = data.map(x => {
              return x.inNumber
            })
            arr3 = data.map(x => {
              return x.outNumber
            })
            key = data.map(x => {
              return x.dayHour
            })
          } else {
            key = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for (let index = 0; index < 24; index++) {
              arr1.push(0)
              arr2.push(0)
              arr3.push(0)
            }
          }
          this.key = key
          this.nowData[0].data = arr1
          this.nowData[1].data = arr2
          this.nowData[2].data = arr3
        }
      })
    },
    changeTime (time) {
      this.timer = time.format("YYYY-MM-DD")
      this.getCount()
      this.$refs.ChartLine.refresh()
    },
    gatAreaList () {
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
      if (id !== 'all') {
        selectBuildList({
          areaId: id
        }).then(({ data: { data = [], code, msg } }) => {
          if (code === 0) {
            this.buildIdList = data
          }
        });
      } else {
        this.buildIdList = []
        this.buildId = 'all'
      }
      this.getCount()
      this.$refs.ChartLine.refresh()
    },
  }
};
</script>

<style lang="less" scoped>
@import '~@/global';

.select-time-type {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  right: 0;
}
</style>
