import api from './api'
import { Reservation, ApiResponse } from '../types'

export const getReservations = () => api.get<ApiResponse<Reservation[]>>('/reservations')
export const createReservation = (data: Omit<Reservation, 'id' | 'status' | 'vehicle' | 'userId'>) =>
  api.post('/reservations', data)

export const updateReservation = (id: string, data: Partial<Reservation>) =>
  api.put(`/reservations/${id}`, data)

export const deleteReservation = (id: string) =>
  api.delete(`/reservations/${id}`)
