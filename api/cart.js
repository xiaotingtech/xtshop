import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'

// 购物车信息列表
export function getCartList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/list`,
    method: 'post',
    data
  })
}
// 添加购物车
export function addCart(data){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/add`,
    method: 'post',
    data
  })
}
// 增加
export function incCart(data){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/inc`,
    method: 'post',
    data
  })
}
//减少
export function decCart(data){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/dec`,
    method: 'post',
    data
  })
}
//删除
export function delCart(data){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/del`,
    method: 'post',
    data
  })
}
//清空
export function clearCart(){
  return request({
    url: `${BASE_URL}/${USER_API}/cart/clear`,
    method: 'post'
  })
}