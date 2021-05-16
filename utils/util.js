const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
function TimeCodeYmd(){
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-');
}

var sub = function(val){
  if(val.length == 0 || val == undefined){
    return;
  }
  if(val.length > 10){
    return val.substring(0,8)+"";
  }else{
    return val;
  }
}

module.exports = {
  formatTime,
  TimeCodeYmd,
  sub
}
