import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'

/**
 * 创建订单去购买
 * @param {Object} data
 */
export function createOrder(data){
  return request({
    url: `${BASE_URL}/${USER_API}/pay/buy`,
    method: 'post',
	data
  })
}
/**
 * 查询订单状态
 */
export function queryOrder(data){
  return request({
    url: `${BASE_URL}/${USER_API}/pay/payback`,
    method: 'post',
	data
  })
}
// 订单列表
export function getOrderList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/list`,
    method: 'post',
	data
  })
}
/**
 * 取消订单
 * @param {Object} data
 */
export function closeOrder(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/cancel`,
    method: 'post',
	data
  })
}
/**
 * 确认订单
 * @param {Object} data
 */
export function confirmProductOrder(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/confirm`,
    method: 'post',
	data
  })
}
/**
 * 查询物流
 * @param {Object} data
 */
export function queryExpress(data){
  return request({
    url: `${BASE_URL}/${USER_API}/express/query`,
    method: 'post',
	data
  })
}