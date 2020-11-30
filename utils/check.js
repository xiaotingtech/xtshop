//校验手机格式
export function checkPhone(val) {
    return /^1[3456789]\d{9}$/.test(val)
  }
function checkMobile(mobile){
    if(isNaN(mobile)){
        // uni.showModal({
        //     title: "提示",
        //     content: "请输入正确格式的手机号码",
        //     success: function success(res) {
        //       if (res.confirm) {
        //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        //         updateManager.applyUpdate();
        //       }
        //     }
        //   });
        uni.showToast({
            title: '请输入正确格式的手机号码',
            icon: 'none',
            duration: 2000
          });
		return false;
    }
    return RegExp(/^1[34578]\d{9}$/).test(mobile);
    
}
function checkId(num){
	if(num == ''){
        uni.showToast({
            title: '请输入正确格式的身份证号码',
            icon: 'none',
            duration: 2000
          });
		return false;
	}
	if(num != ''){
    var len = num.length;
    if(len === 15 || len === 18){
      let re15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
      let re18 =  /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      var res = (re15.test(num) || re18.test(num));
      if(res==false){ 
        // 未通过验证
        uni.showToast({
          title: '请输入正确格式的身份证号！',
          icon: 'none',
          duration: 2000
        });
        return false;
      }else{
        // 通过验证
        return res
      }
    }else{
      uni.showToast({
        title: '输入的身份证号码长度不正确',
        icon: 'none',
        duration: 2000
      });
    return false;
    }
  }
}
module.exports = {
	checkId : checkId,
	checkMobile : checkMobile
}