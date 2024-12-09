import request from '@/utils/request'

// 查询账户流水列表
export function listTransaction(query) {
  return request({
    url: '/wallet/transaction/list',
    method: 'get',
    params: query
  })
}

// 查询账户流水详细
export function getTransaction(id) {
  return request({
    url: '/wallet/transaction/' + id,
    method: 'get'
  })
}

// 新增账户流水
export function addTransaction(data) {
  return request({
    url: '/wallet/transaction',
    method: 'post',
    data: data
  })
}

// 修改账户流水
export function updateTransaction(data) {
  return request({
    url: '/wallet/transaction',
    method: 'put',
    data: data
  })
}

// 删除账户流水
export function delTransaction(id) {
  return request({
    url: '/wallet/transaction/' + id,
    method: 'delete'
  })
}
