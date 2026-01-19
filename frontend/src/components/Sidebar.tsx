import { useAuth } from '../context/AuthContext';
import { logoutApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutApi();
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            // Force la déconnexion en cas d'erreur
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className="w-64 bg-white border-l border-gray-200 h-[calc(100vh-64px)] fixed right-0 top-16 flex flex-col p-4 shadow-sm z-9">
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                >
                    Déconnexion
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}
