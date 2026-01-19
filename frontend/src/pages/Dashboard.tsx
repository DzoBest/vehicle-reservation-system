import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ReservationModal from '../components/ReservationModal';
import ConflictModal from '../components/ConflictModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { getReservations, createReservation, updateReservation, deleteReservation } from '../api/reservation.api';
import { getVehicles } from '../api/vehicle.api';
import { Reservation, Vehicle } from '../types';

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Conflict Warning State
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState<{ startDate: string, endDate: string }[] | null>(null);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, resVeh] = await Promise.all([getReservations(), getVehicles()]);
      // The backend returns an object { message: string, data: T[] }
      // Axios response is { data: { message: ..., data: ... }, ... }
      // We need to access res.data.data
      setReservations(resRes.data.data);
      setVehicles(resVeh.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setReservationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reservationToDelete) return;
    try {
      await deleteReservation(reservationToDelete);
      setReservations(prev => prev.filter(r => r.id.toString() !== reservationToDelete.toString()));
      setIsDeleteModalOpen(false);
      setReservationToDelete(null);
    } catch (error) {
      console.error("Error deleting reservation", error);
      alert("Erreur lors de l'annulation");
    }
  };

  const handleModalSubmit = async (startDate: string, endDate: string) => {
    try {
      // Backend validation requires proper fields.
      // Dates: sending YYYY-MM-DD works with standard VineJS configuration.
      // VehicleId: Must be a number.

      if (modalMode === 'create' && selectedVehicle) {
        await createReservation({
          vehicleId: Number(selectedVehicle.id),
          startDate: startDate,
          endDate: endDate
        });
        fetchData();
      } else if (modalMode === 'edit' && selectedReservation) {
        // Use vehicleId from the relation if the direct field is missing
        const vId = selectedReservation.vehicle?.id || selectedReservation.vehicleId;

        await updateReservation(selectedReservation.id.toString(), {
          vehicleId: Number(vId),
          startDate: startDate,
          endDate: endDate
        });
        fetchData();
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving reservation", error);

      // Handle Conflict (409)
      if (error.response && error.response.status === 409 && error.response.data.conflict) {
        // Close reservation modal first (optional logic, but cleaner UX to focus on warning)
        // Or keep it open? User said "help user to choose date". 
        // Keeping it open might be better but modal over modal is tricky.
        // Let's keep ReservationModal open but show ConflictModal "on top".
        // React portals handle this usually, or simple z-index.

        setConflictData(error.response.data.conflict);
        setIsConflictModalOpen(true);
        return;
      }

      if (error.response && error.response.data) {
        // Validation errors often come as { errors: [{ field: '...', message: '...' }] }
        console.error("Backend error details:", error.response.data);
      }
      const msg = error.response?.data?.message ||
        (error.response?.data?.errors ? error.response.data.errors[0].message : "Erreur de validation");
      alert("Erreur: " + msg);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 p-6 pr-72 h-full overflow-hidden flex flex-col"> {/* Right padding for Sidebar & Flex Col */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden min-h-0">

            {/* Left Column: Vehicles (Glissable) */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex-none">
                <h2 className="font-bold text-gray-700 text-lg">Véhicules Disponibles</h2>
                <p className="text-xs text-gray-500">Glissez pour voir plus</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                        {vehicle.brand[0]}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-gray-500 mb-3">{vehicle.licensePlate}</p>
                    <button
                      onClick={() => handleCreateClick(vehicle)}
                      className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors opacity-90 hover:opacity-100"
                    >
                      Réserver
                    </button>
                  </div>
                ))}
                {vehicles.length === 0 && !loading && (
                  <p className="text-center text-gray-400 py-10">Aucun véhicule disponible</p>
                )}
              </div>
            </div>

            {/* Main Area: Reservations */}
            <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-6 flex-none">
                <h1 className="text-2xl font-bold text-gray-800">Mes Réservations</h1>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {reservations.map(reservation => (
                      <div key={reservation.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {reservation.vehicle?.brand || 'Véhicule'} {reservation.vehicle?.model}
                            </h3>
                          </div>
                        </div>
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Du</span>
                            <span className="font-medium text-gray-800">{new Date(reservation.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Au</span>
                            <span className="font-medium text-gray-800">{new Date(reservation.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleEditClick(reservation)}
                            className="flex-1 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteClick(reservation.id.toString())}
                            className="flex-1 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ))}
                    {reservations.length === 0 && !loading && (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p>Aucune réservation pour le moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        <Sidebar />
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedReservation}
        mode={modalMode}
      />

      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflictDates={conflictData}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Annuler la réservation"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
        confirmText="Oui, annuler"
        isDestructive={true}
      />
    </div>
  );
}
