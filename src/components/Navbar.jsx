import { useMsal, useAccount } from '@azure/msal-react';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ roles = [] }) => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/"
        });
    };
    const name = account?.name || 'Usuario';
    const email = account?.username || '';
    const rolesDisplay = roles.length > 0 ? `Rol: ${roles.join(', ')}` : 'Rol: Cliente';

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-slate-900 tracking-tight text-xl">
                                DigitalFix
                            </span>
                        </div>
                    </div>                
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col text-right hidden sm:flex justify-center">
                            <div className="text-sm font-semibold text-gray-900 flex items-center justify-end gap-1">
                                {name} 
                                {rolesDisplay && (
                                    <span className="text-[10px] uppercase tracking-wider text-black-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                                        {rolesDisplay}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">{email}</div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 border border-blue-100 flex items-center justify-center text-indigo-600 shadow-sm sm:hidden">
                            <User size={18} />
                        </div>
                        <div className="w-px h-6 bg-gray-200 hidden sm:block mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200 group"
                            title="Cerrar sesión"
                        >
                            <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="ml-2 text-sm font-medium hidden md:block">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
