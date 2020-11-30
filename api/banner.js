import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'


// 首页轮播
export function getHomeBanner(){
  return request({
    url: `${BASE_URL}/${USER_API}/banner/list`,
    method: 'post'
  })
}