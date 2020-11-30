import { BASE_URL, USER_API, USER_API2 } from '@/settings'
import request from '@/utils/request'

/**
 * 推荐的专题列表
 * @param {Object} data
 */
export function getRecommendSubjectList(data){
  return request({
    url: `${BASE_URL}/${USER_API}/subject/recommend`,
    method: 'post',
	data
  })
}