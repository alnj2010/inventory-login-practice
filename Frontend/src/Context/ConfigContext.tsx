import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../Auth/ApiURL"; // O donde tengas tu URL de la API

interface ConfigContextType {
  tasa: number;
  loading: boolean;
  formatBs: (usd: number) => string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasa, setTasa] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/config/tasa`)
      .then((res) => res.json())
      .then((data) => {
        setTasa(data.tasa);
        setLoading(false);
      })
      .catch((err) => console.error("Error al cargar tasa:", err));
  }, []);

  // Función global para formatear precios de USD a Bs
  const formatBs = (usd: number) => {
    const total = usd * tasa;
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VED",
    }).format(total);
  };

  return (
    <ConfigContext.Provider value={{ tasa, loading, formatBs }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context)
    throw new Error("useConfig debe usarse dentro de ConfigProvider");
  return context;
};
