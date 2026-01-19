import { useState, useEffect } from 'react';
import { Reservation } from '../types';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (start: string, end: string) => void;
    initialData?: Reservation | null;
    mode: 'create' | 'edit';
}

export default function ReservationModal({ isOpen, onClose, onSubmit, initialData, mode }: ReservationModalProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [todayDate] = useState(() => new Date().toISOString().slice(0, 10));

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                // Format for date: YYYY-MM-DD
                const start = new Date(initialData.startDate).toISOString().slice(0, 10);
                const end = new Date(initialData.endDate).toISOString().slice(0, 10);
                setStartDate(start);
                setEndDate(end);
            } else {
                setStartDate('');
                setEndDate('');
            }
            setError('');
        }
    }, [isOpen, initialData, mode]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            setError('Veuillez sélectionner les dates.');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            setError('La date de fin doit être après la date de début.');
            return;
        }
        onSubmit(startDate, endDate);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {mode === 'create' ? 'Nouvelle Réservation' : 'Modifier la Réservation'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={todayDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || todayDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md hover:shadow-lg transform active:scale-95 duration-100"
                        >
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
