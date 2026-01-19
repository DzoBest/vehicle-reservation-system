import { useRef, useEffect } from 'react';

interface ConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    conflictDates: { startDate: string; endDate: string }[] | null;
}

export default function ConflictModal({ isOpen, onClose, conflictDates }: ConflictModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Fermeture du modal au clic en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !conflictDates) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
            >
                <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-center gap-4">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Véhicule Indisponible</h2>
                        <p className="text-sm text-gray-600">Ce véhicule est réservé aux dates suivantes</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide sticky top-0 bg-amber-50 pb-2 border-b border-amber-100">
                            Calendrier des réservations
                        </h3>
                        {conflictDates.map((date, index) => (
                            <div key={index} className="flex justify-between items-center text-gray-700 py-2 border-b border-amber-100 last:border-0">
                                <span className="font-medium text-sm">{new Date(date.startDate).toLocaleDateString()}</span>
                                <span className="text-amber-400 text-xs">➜</span>
                                <span className="font-medium text-sm">{new Date(date.endDate).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-500 text-sm mb-4 text-center">
                        Veuillez choisir une période en dehors de ces dates.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg active:scale-95 transform duration-150"
                    >
                        Choisir une autre date
                    </button>
                </div>
            </div>
        </div>
    );
}
