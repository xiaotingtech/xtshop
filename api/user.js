import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'
import Vue from 'vue'

// 浏览列表
export function getBrowseList(){
  return request({
    url: `${BASE_URL}/${USER_API}/user/browselist`,
    method: 'post'
  })
}
// 收藏商品
export function collectProduct(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/collect`,
    method: 'post',
	data:data
  })
}
//收藏列表
export function collectProductList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/collectlist`,
    method: 'post',
	data:data
  })
}

// 微信登录
export function loginWechat(){
	return new Promise((resolve, reject) => {
			uni.login({
			provider: "weixin",
			success: loginRes => {
			  request({
				url: `${BASE_URL}/${USER_API}/user/login`,
				method: 'post',
				data:{code:loginRes.code}
			  }).then(codeRes=> {
				uni.setStorageSync('token',codeRes.token);  
				Vue.prototype.$store.state.hasLogin=true;  
				Vue.prototype.$store.state.userInfo=codeRes;
				resolve({isLogin:true,result:codeRes});
			  }).catch(err=> { 
				  console.log('debug log --> ', err)
				  reject(new Error((error.errMsg)))
				})
			},
			fail: (loginErr) => {
			  reject(new Error((loginErr.errMsg)))
			}
		  })
	  });
}
// 更新信息
export function updateInfo(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/update`,
    method: 'post',
	data:data
  })
}
// 绑定手机
export function updatePhone(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/phone`,
    method: 'post',
	data:data
  })
}
// 用户信息
export function infoData(){
  return request({
    url: `${BASE_URL}/${USER_API}/user/info`,
    method: 'post'
  })
}