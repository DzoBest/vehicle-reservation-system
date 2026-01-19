export interface Vehicle {
  id: number;
  model: string;
  brand: string;
  image?: string;
  licensePlate: string;
  pricePerDay: number;
  status: 'available' | 'maintenance' | 'rented';
}

export interface Reservation {
  id: number;
  vehicleId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  vehicle?: Vehicle;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
