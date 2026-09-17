import { useIsAuthenticated, useMsal } from "@azure/msal-react";
export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
 
  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <header className="flex justify-center items-center px-6 md:px-12 py-4 bg-white border-b border-slate-200 w-full relative">
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-900 tracking-tight text-xl">DigitalFix</span>
      </div>
       
      {isAuthenticated && accounts.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-800 leading-tight">
              {accounts[0].name}
            </span>
            <span className="text-[11px] text-slate-500">
              {accounts[0].username}
            </span>
          </div>
          <button onClick={handleLogout} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200">
            Cerrar sesion
          </button>
        </div>
      )}
    </header>
  );
}
