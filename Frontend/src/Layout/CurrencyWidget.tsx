import { useConfig } from "../Context/ConfigContext"; // Ajusta la ruta si es necesario

export const CurrencyWidget: React.FC = () => {
  const { tasa, loading } = useConfig();

  // Mientras carga la tasa del Backend/BCV
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm italic">
        Cargando tasa...
      </div>
    );
  }

  // Si no hay tasa o es cero (por error o configuración inicial)
  if (!tasa) {
    return (
      <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
        ⚠️ Tasa no configurada
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 bg-green-100 text-green-900 px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm border border-green-200">
      {/* Pequeño punto verde titilando (Efecto "En vivo") */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
      </span>
      BCV: <span className="font-bold">{tasa.toFixed(2)}</span> Bs/$
    </div>
  );
};
