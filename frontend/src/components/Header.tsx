import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user } = useAuth();
    const userName = user?.firstName ? `${user.firstName.charAt(0).toUpperCase()}. ${user.lastName?.toUpperCase() || ''}` : user?.email || 'Invité';

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 relative">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    A
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">Data Lab Parking</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">
                    Bienvenue <span className="font-semibold text-green-700">{userName}</span>
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    {userName.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
