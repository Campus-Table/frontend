import { apiFetch } from './client'

export function getStore(storeId) {
  return apiFetch(
    `/api/stores/${storeId}`
  )
}

export function getStoreMenus(storeId) {
  return apiFetch(
    `/api/stores/${storeId}/menus`
  )
}