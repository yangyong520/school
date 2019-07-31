<template>
  <!-- 饼状 -->
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String,
    // 南丁格尔图,
    // 'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。
    // 'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
    roseType: {
      type: String,
      default: 'radius'
    },
    // color
    color: {
      type: Array,
      default: () => {
        return ['#99C4FF', '#99D7FF', '#FFA4BE', '#F6A1A6', '#FFCEA6', '#78DEDF']
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
      let legend = this.value.map(x => x.name)
      let option = {
        color: this.color,
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 50,
          right: 0,
          itemGap: 20,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 14,
            color: '#333'
          },
          data: legend,
          formatter: (name) => {
            var total = 0
            var target
            for (var i = 0, l = this.value.length; i < l; i++) {
              total += this.value[i].value
              if (this.value[i].name === name) {
                target = this.value[i].value
              }
            }
            var arr = [
              name + ':（' + ((target / total) * 100).toFixed(1) + '%）' + target
            ]

            return arr
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['30%', '50%'],
            data: this.value,
            roseType: this.roseType,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
