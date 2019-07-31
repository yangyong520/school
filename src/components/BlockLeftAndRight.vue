<template>
  <div class="BlockLeftAndRight">
    <div class="student-block">
      <span>{{title}}</span>
      <ul class="student-block-ul">
        <li
          v-for="(item,index) in dataArr"
          :key="index + '-BlockLeftAndRight'"
        >
          <span>{{item.itemTitle}}</span>
          <span>{{item.dataCount}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockLeftAndRight',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    dataArr: {
      type: Array,
      default: () => [{
        itemTitle: '项标题',
        dataCount: 12
      }, {
        itemTitle: '项标题',
        dataCount: 12
      }, {
        itemTitle: '项标题',
        dataCount: 12
      }]
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';
.BlockLeftAndRight{
  width: 100%;
  height: 100%;
}
.student-block {
  .box-shadowSet;
  .tb-flex-between;
  .set-border;
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #424242;
  font-size: 12px;
  box-sizing: border-box;
  // border-left: 24px solid transparent;
  padding: 13px 10px;
  &>span{
    font-weight: bold;
    color: @styleColor;
    border-bottom: 1px solid #D0E3FE;
    padding: 10px 0;
  }
  .student-block-ul{
    display: flex;
    text-align: center;
    flex-direction: column;
    li{
      display: flex;
      width: 80%;
      justify-content: space-between;
      padding: 14px 0 0 0;
      &:last-of-type{
        padding: 14px 0 14px 0;
      }
      &:nth-of-type(1){
        span{
          &:nth-of-type(1){
            &::before{
              background-color: @styleColor;
            }
          }
        }
      }
      &:nth-of-type(2){
        span{
          &:nth-of-type(1){
            &::before{
              background-color: @closeColor;
            }
          }
        }
      }
      &:nth-of-type(3){
        span{
          &:nth-of-type(1){
            &::before{
              background-color: #EA0060;
            }
          }
        }
      }
      &:nth-of-type(4){
        span{
          &:nth-of-type(1){
            &::before{
              background-color: #AF4FD5;
            }
          }
        }
      }
      span{
        &:nth-of-type(1){
          display: flex;
          align-items: center;
          &::before{
            content: " ";
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
