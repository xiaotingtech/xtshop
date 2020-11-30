import CryptoJS from 'crypto-js';
import { enc } from 'crypto-js/core';
import Vue from 'vue'

let channel = ''
// #ifdef H5
channel = 'weapp'
// #endif

// #ifdef MP-WEIXIN
channel = 'xcx'
let version='1.0.0'
let time =new Date().getTime()
let platform = uni.getSystemInfoSync().platform
// #endif
let key1 = 'shop2020101front'
let iv1 = 'sunnier202010198'
export default function request(options, config){
  options = Object.assign(options, {
    data: { code: options.data ? encrypt(options.data) : ''},
    header: {
      globalinfo: encrypt({
          token: uni.getStorageSync('token') ? uni.getStorageSync('token'): null,
          platform: platform,
          channel: channel,
          version: version,
          time: time
        })
    }
  })
  if(options.data.code){
    console.log('debug log -加密前的参数->', decrypt(options.data.code));
  }
  const showToast = !(config && config.showToast === false)
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (response) => {
        if(response && response.data){
          var res = decrypt(response.data.code)
          console.log('debug log -接口返回-> ', res.data);
          if(res.status == 1){
            resolve(res.data)
          }else{
            console.log("此接口返回status不是1")
            console.log('debug log -->', res);
            console.log('debug log -->', res.status);
            if(res.status == '-10020'){
			  Vue.prototype.$store.state.hasLogin=false;
			  resolve([]);
            }else{
			  showToast && uni.showToast({
			    title: res.msg,
			    icon: 'none',
			    duration: 2000
			  })
			}
          }
        }else{
          console.log('debug log -没有返回->', response);
        }
      },
      fail: (error) => {
        console.log('debug log -请求报错->', error);
        showToast && uni.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        })
        reject(new Error((error.errMsg)))
      }
    })
  })
}
//aes加密
export function encrypt(word) {
  var key = CryptoJS.enc.Utf8.parse(key1); //16位
  var iv = CryptoJS.enc.Utf8.parse(iv1);
 
  var encrypted = '';
  if (typeof(word) == 'string' || typeof(word)== 'number') {
      var srcs = CryptoJS.enc.Utf8.parse(word);
      encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
  } else if (typeof(word) == 'object') {//对象格式的转成json字符串
      var data = JSON.stringify(word);
      var srcs = CryptoJS.enc.Utf8.parse(data)
      encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})
  }
  return encrypted.ciphertext.toString();
}
// aes解密
function decrypt(word) {
  var key = CryptoJS.enc.Utf8.parse(key1); 
  var iv = CryptoJS.enc.Utf8.parse(iv1);
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  var decryptData = JSON.parse(decryptedStr)
  return decryptData;
}
