import { apiFetch } from './client'

export function getCafeterias() {
  return apiFetch('/api/cafeterias')
}

export function getCafeteria(cafeteriaId) {
  return apiFetch(
    `/api/cafeterias/${cafeteriaId}`
  )
}

export function getCafeteriaStores(cafeteriaId) {
  return apiFetch(
    `/api/cafeterias/${cafeteriaId}/stores`
  )
}

export function getCafeteriaStatus(cafeteriaId) {
  return apiFetch(
    `/api/cafeterias/${cafeteriaId}/status`
  )
} 
