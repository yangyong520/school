export const test = function (...testArr) {
  let msg = ''
  let status = true
  status = testArr.every((ele) => {
    if (ele === null) {
      return true
    }
    if (!ele.status) {
      msg = ele.msg
    }
    return ele.status
  })
  return {
    msg,
    status
  }
}

export const IDcardTest = function (card, msg = '') {
  // const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
  const status = reg.test(card)
  return {
    status,
    msg: reg.test(card) ? `${msg}身份证合法` : `${msg}身份证不合法`
  }
}
export const PhoneTest = function (phone, msg = '') {
  const reg = /^1[3457869]\d{9}$/
  const status = reg.test(phone)
  return {
    status,
    msg: reg.test(phone) ? `${msg}手机号码合法` : `${msg}手机号码不合法`
  }
}
export const NameTest = function (name, msg = '') {
  const reg = /^[\u4e00-\u9fa5]{2,4}$/
  const status = reg.test(name)
  return {
    status,
    msg: reg.test(name) ? `${msg}姓名长度正确` : `${msg}姓名长度为2-4个汉字！`
  }
}
// 文字长度最多20字
export const WordTest = function (word, msg) {
  const status = word.length <= 20
  return {
    status,
    msg: word.length < 20 ? `${msg}文字长度正确` : msg
  }
}
// 文字长度最多140字
export const WordLangTest = function (wordLang, msg) {
  const status = wordLang.length < 140
  return {
    status,
    msg: wordLang.length < 140 ? `${msg}文字长度正确` : msg
  }
}
// 正整数
export const IntegerTest = function (integer, msg) {
  const reg = /^[+]{0,1}(\d+)$/
  const status = reg.test(integer)
  return {
    status,
    msg: reg.test(integer) ? `${msg}正确` : msg
  }
}
// 判断数组，是否不含重复值
export const TepeatArrTest = function (arr, msg) {
  const originLength = arr.length
  if (originLength === 0 || !arr.every(ele => ele)) {
    return {
      status: false,
      msg: `存在${msg}为空`
    }
  }
  const noRepeatLenght = [...new Set(arr)].length
  const status = Boolean(originLength === noRepeatLenght)
  return {
    status,
    msg: status ? `${msg}无重复` : `${msg}重复`
  }
}
