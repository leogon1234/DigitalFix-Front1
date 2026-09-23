import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12"> 
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto z-10"> 
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-3">Administración de Ordenes de Trabajo</h1>
              <p className="text-slate-600 font-medium text-base leading-relaxed"> Plataforma para órdenes de trabajo de mantención eléctrica.</p>
            </div> 
            <div className="bg-white rounded-[16px] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-300 w-full text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Bienvenido a la plataforma</h2>
              <p className="text-slate-500 text-sm mt-3 px-2">
                Identifícate con tus credenciales corporativas para acceder
              </p> 
              <button onClick={handleLogin} className="mt-8 w-full flex items-center justify-center gap-3 border border-slate-300 bg-white rounded-xl py-3 px-4 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft Logo"
                  className="w-5 h-5"
                />
                Continuar con cuenta Microsoft
              </button>
              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="text-[11px] text-slate-400 leading-relaxed px-4 font-bold">
                  Acceso restringido a personal registrado.
                </p>
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
