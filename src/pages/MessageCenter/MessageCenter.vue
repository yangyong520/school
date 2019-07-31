<template>
  <div class="MessageCenter">
    <Title title="返回-消息中心" style="cursor: pointer;" @click.native="$router.back()"/>
    <div style="margin: 20px 0"></div>
    <DataTable class="data-table" :showRowSelection="false" :columns="columns" reqType="msg"></DataTable>
  </div>
</template>

<script>
import Vue from 'vue'
import DataTable from '@/components/DataTable'
import req from '@/req/req'
import { mapState } from 'vuex'

const { getCountNum } = req;
export default {
  name: 'MessageCenter',
  components: {
    DataTable
  },
  data () {
    return {
      columns: [
        {
          title: '类型',
          dataIndex: 'showType'
        },
        {
          title: '内容',
          dataIndex: 'content'
        },
        {
          title: '时间',
          dataIndex: 'sendTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                <span onClick={() => this.change(record)} >
                  去查看
                </span>
              </div>
            )
          }
        }
      ],
      roleCon: [],
    }
  },
  mounted () {
    this.getCountNum()
    this.showTap()
  },
  computed: {
    ...mapState(['havRoleList']),
    routeList () {
      const list = [
        {
          name: '调寝',
          key: 'applicationNotes',
        },
        {
          name: '报修',
          key: 'applicationNotes',
        },
        {
          name: '被访',
          key: 'applicationNotes',
        },
        {
          name: '请假',
          key: 'applicationNotes',
        },
        {
          name: '未归',
          key: 'pliceNotes',
        },
        {
          name: '晚归',
          key: 'pliceNotes',
        },
        {
          name: '无记录',
          key: 'pliceNotes',
        },
        {
          name: '连进连出',
          key: 'pliceNotes',
        },
        {
          name: '翻越',
          key: 'pliceNotes',
        },
        {
          name: '尾随',
          key: 'pliceNotes',
        },
        {
          name: '黑名单',
          key: 'pliceNotes',
        },
        {
          name: '访客超时',
          key: 'pliceNotes',
        },
        {
          name: '设备异常',
          key: 'pliceNotes',
        }
      ]
      return list
    }
  },
  methods: {
    // 获取权限重组数组
    showTap () {
      const data = Vue.ls.get('USER_DATA')
      if (data.type === 0) {

      } else {
        this.roleCon = this.routeList.filter(ele => {
          return this.havRoleList.some(eleRole => eleRole.moduleName === ele.name)
        })
      }
    },
    getCountNum () {
      getCountNum().then(({data: {data, code, msg}}) => {})
    },
    // 通过数据key来进行路由跳转
    change (item) {
      if (item.type) {
        let routeName = {
          1: 'notice', // 公告
          2: 'applicationNotes', // 更換寢室申請同意
          4: 'applicationNotes', // 報修申請
          5: 'applicationNotes', // 被访
          3: 'applicationNotes', // 请假
          9: 'pliceNotes', // 未归
          6: 'pliceNotes', // 晚归
          10: 'pliceNotes', // 无记录
          13: 'pliceNotes', // 进出
          14: 'pliceNotes', // 翻越
          15: 'pliceNotes', // 尾随
          11: 'pliceNotes', // 黑名单
          8: 'pliceNotes', // 访客超时
          12: 'pliceNotes', // 设备异常
          7: 'breakRuleNotes', // 违纪
        }[item.type]
        // 获取到当前数组
        let dataList = this.roleCon.filter(x => {
          return x.key === routeName
        })
        // 获取下标
        let index = 0
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].name === item.typeStr) {
            index = i
          }
        }
        if (routeName === 'notice') {
          this.$router.push('/mainPage/notice')
        } else if (routeName === 'breakRuleNotes') {
          this.$router.push('/mainPage/breakRuleNotes')
        } else {
          this.$router.push(`/mainPage/${routeName}/${index}`)
        }
      }
      this.getCountNum()
    }
  },
  watch: {
    routeList () {
      this.showTap()
    }
  },
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
