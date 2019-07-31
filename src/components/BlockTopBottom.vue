<template>
  <div class="BlockTopBottom">
    <div class="uers-block">
      <span>{{title}}</span>
      <ul class="uers-block-ul">
        <li v-for="(item,index) in dataArr" :key="index + 'BlockTopBottom'">
          <span>{{item.dataCount}}</span>
          <span>{{item.itemTitle}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockTopBottom",
  props: {
    title: {
      type: String,
      default: "标题"
    },
    dataArr: {
      type: Array,
      default: () => [
        {
          itemTitle: "项标题",
          dataCount: 12
        },
        {
          itemTitle: "项标题",
          dataCount: 12
        },
        {
          itemTitle: "项标题",
          dataCount: 12
        }
      ]
    }
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<style scoped lang="less">
@import '~@/global';
.uers-block {
  .box-shadowSet;
  .tb-flex-between;
  flex: 1;
  background-color: #fff;
  color: @styleColor;
  font-size: 12px;
  box-sizing: border-box;
  padding: 13px 10px;
  width: 100%;
  height: 100%;
  & > span {
    font-weight: bold;
    border-bottom: 1px solid #d0e3fe;
    padding: 10px 0;
  }
  .set-border;
  .uers-block-ul {
    display: flex;
    text-align: center;
    justify-content: space-around;
    color: #424242;
    li {
      display: flex;
      flex-direction: column;
      span {
        padding: 15px 0;
        &:nth-of-type(1) {
          font-size: 18px;
        }
        &:nth-of-type(2) {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
