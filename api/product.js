import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'
// 首页商品
export function getHomeProduct(){
  return request({
    url: `${BASE_URL}/${USER_API}/product/home`,
    method: 'post'
  })
}
// 分类商品
export function getProductList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/list`,
    method: 'post',
    data
  })
}
// 首页专题商品
export function getSubjectRecommendProductList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/subjectrecommend`,
    method: 'post',
    data
  })
}
// 专题商品
export function getSubjectProductList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/subject`,
    method: 'post',
    data
  })
}
// 推荐商品
export function getRecommendProductList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/recommend`,
    method: 'post',
    data
  })
}
// 商品详情
export function getProductDetail(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/detail`,
    method: 'post',
    data
  })
}

// 商品收藏列表
export function collectlist(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/collectlist`,
    method: 'post',
    data
  })
}
// 收藏/取消收藏
export function collectproduct(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/collect`,
    method: 'post',
    data
  })
}
// 足迹列表
export function browselist(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/browselist`,
    method: 'post',
    data
  })
}
// 清空足迹
export function browseclear(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/browseclear`,
    method: 'post',
    data
  })
}
// 分类列表
export function getCategoryList(){
  return request({
    url: `${BASE_URL}/${USER_API}/category/list`,
    method: 'post'
  })
}

// 首页推荐分类列表
export function getRecommendCategoryList(){
  return request({
    url: `${BASE_URL}/${USER_API}/category/recommend`,
    method: 'post'
  })
}

// 首页活动分类列表
export function getActivityCategoryList(){
  return request({
    url: `${BASE_URL}/${USER_API}/category/activity`,
    method: 'post'
  })
}

export function toplist(data){
  return request({
    url: `${BASE_URL}/${USER_API}/product/list`,
    method: 'post',
    data
  })
}

export function teacherDetail(data){
  return request({
    url: `${BASE_URL}/${USER_API}/teacher/detail`,
    method: 'post',
    data
  })
}


export function checkCoupon(data){
  return request({
    url: `${BASE_URL}/${USER_API}/coupon/valid`,
    method: 'post',
    data
  })
}


export function payproduct(data){
  return request({
    url: `${BASE_URL}/${USER_API}/pay/buy`,
    method: 'post',
    data
  })
}
export function payproductV2(data){
  return request({
    url: `${BASE_URL}/${USER_API2}/pay/buy`,
    method: 'post',
    data
  })
}

export function payback(data){
  return request({
    url: `${BASE_URL}/${USER_API}/pay/payback`,
    method: 'post',
    data
  })
}
// 订单列表
export function orderlist(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/list`,
    method: 'post',
    data
  })
}
// 取消订单
export function concelOrder(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/cancel`,
    method: 'post',
    data
  })
}

export function orderDetail(data){
  return request({
    url: `${BASE_URL}/${USER_API}/order/detail`,
    method: 'post',
    data
  })
}

export function orderNum(){
  return request({
    url: `${BASE_URL}/${USER_API}/order/num`,
    method: 'post'
  })
}
// 用户信息
export function getUserInfo(data){
  return request({
    url: `${BASE_URL}/${USER_API}/user/info`,
    method: 'post',
    data
  })
}

// 立即报名
export function joinInfo(data){
  return request({
    url: `${BASE_URL}/${USER_API}/join/info`,
    method: 'post',
    data
  })
}