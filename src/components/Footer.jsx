export default function Footer() {
  return (
    <footer className="bg-slate-700 text-slate-100 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs gap-4 mt-auto">
      <p>© 2026 DigitalFix. Todos los derechos reservados.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
        <a href="#" className="hover:text-white transition-colors">Términos del Servicio</a>
        <a href="#" className="hover:text-white transition-colors">Soporte TI</a>
      </div>
    </footer>
  );
}
