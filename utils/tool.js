export function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

/*
 * 时间戳转换为yyyy-MM-dd hh:mm:ss 格式  formatDate()
 * inputTime   时间戳
 */
export function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  // return y + '-' + m + '-' + d;
  return m + '-' + d;
}
export function formatFullDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}
export function formatDateAll(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
export function fullTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '/' + m + '/' + d;
}
export function getHourtime(inputTime) {
  var date = new Date(inputTime);
  // var y = date.getFullYear();
  // var m = date.getMonth() + 1;
  // m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  return h + ':' + minute;
}

export function checkAuditTime(beginTime, endTime){
  var nowDate = new Date();
  var beginDate = new Date(nowDate);
  var endDate = new Date(nowDate);

  var beginIndex = beginTime.lastIndexOf("\:");
  var beginHour = beginTime.substring(0, beginIndex);
  var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
  beginDate.setHours(beginHour, beginMinue, 0, 0);

  var endIndex = endTime.lastIndexOf("\:");
  var endHour = endTime.substring(0, endIndex);
  var endMinue = endTime.substring(endIndex + 1, endTime.length);
  endDate.setHours(endHour, endMinue, 0, 0);
  if(nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime()){
    return 1;
  }else{
    return 2;
  }
}
