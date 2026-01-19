import api from './api'
import { Vehicle, ApiResponse } from '../types'

export const getVehicles = () => api.get<ApiResponse<Vehicle[]>>('/vehicles')
