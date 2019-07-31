<template>
  <!-- 柱状 -->
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    // 数据
    value: Array,
    // x轴显示数据
    xData: Array,
    // 居中标题
    text: String,
    subtext: String,
    // 是否显示x轴坐标线
    xSplitLine: {
      type: Boolean,
      default: false
    },
    ySplitLine: {
      type: Boolean,
      default: false
    },
    color: {
      type: Array,
      default: () => {
        return ['#00C9F8', '#F93E58', '#FCE630']
      }
    },
    // 图例
    legend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    grid: {
      type: Object,
      default: () => {
        return {
          left: '5%', // 距离左边距
          right: '15%' // 距离右边距
        }
      }
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      let xAxisData = this.xData
      let seriesData = this.value
      let option = {
        legend: this.legend,
        tooltip: {
          trigger: 'axis'
        },
        grid: this.grid,
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'left',
          textStyle: {
            fontSize: 14,
            color: '#333',
            fontWeight: '500'
          }
        },
        xAxis: {
          splitLine: {show: this.xSplitLine},
          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: xAxisData
        },
        yAxis: {
          splitLine: {show: this.ySplitLine},
          type: 'value'
        },
        color: this.color,
        series: seriesData
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
