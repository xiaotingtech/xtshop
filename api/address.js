import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'


// 地址列表
export function getAddressList(){
  return request({
    url: `${BASE_URL}/${USER_API}/address/list`,
    method: 'post'
  })
}

// 地址修改
export function saveAddressData(data){
  return request({
    url: `${BASE_URL}/${USER_API}/address/save`,
    method: 'post',
	data
  })
}

// 获取默认地址
export function getDefaultAddress(){
  return request({
    url: `${BASE_URL}/${USER_API}/address/default`,
    method: 'post'
  })
}