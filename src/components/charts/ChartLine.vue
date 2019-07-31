<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'chart-line',
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
    this.init()
  },
  methods: {
    init () {
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        grid: this.grid,
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisLabel: {
              interval: 0
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#999',
              }
            },
          }
        ],
        yAxis: [
          {
            axisLine: {
              show: false,
              color: '#999',
              type: 'dashed',
            },
            axisTick: {
              show: false
            },
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eee'],
                width: 1,
                type: 'dashed'
              }
            },
          },
        ],
        series: this.value
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    },
    refresh () {
      this.init()
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  watch: {
    xData () {
      this.refresh()
    }
  },
}
</script>
