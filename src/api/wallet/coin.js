import request from '@/utils/request'

// 查询币种列表
export function listCoin(query) {
  return request({
    url: '/wallet/coin/list',
    method: 'get',
    params: query
  })
}

// 查询币种详细
export function getCoin(id) {
  return request({
    url: '/wallet/coin/' + id,
    method: 'get'
  })
}

// 新增币种
export function addCoin(data) {
  return request({
    url: '/wallet/coin',
    method: 'post',
    data: data
  })
}

// 修改币种
export function updateCoin(data) {
  return request({
    url: '/wallet/coin',
    method: 'put',
    data: data
  })
}

// 删除币种
export function delCoin(id) {
  return request({
    url: '/wallet/coin/' + id,
    method: 'delete'
  })
}
