const multipleSelect = {
  methods: {
    watchSelectBtn (newVal, listArr, setStr) {
      if (
        newVal.length === 0 ||
        (listArr.length === newVal.length && newVal.every(ele => ele !== 'all')) ||
        (newVal.length > 1 && newVal[newVal.length - 1] === 'all')
      ) {
        if (listArr.length === 1) {
          this[setStr] = newVal[0]
        } else {
          this[setStr] = ['all']
        }
        return
      } else if (newVal.length > 1 && newVal.some(ele => ele === 'all')) {
        this[setStr] = newVal.filter(ele => ele !== 'all')
        return
      }
      if (newVal.length === 0) {
        return
      }
      this.$emit('changeVal', newVal)
    }
  }
}

export { multipleSelect }
