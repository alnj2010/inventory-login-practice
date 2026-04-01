import React, { useState } from "react";
import { API_URL } from "../Auth/ApiURL";
import { useAuth } from "../Auth/AuthProvider";

interface Props {
  onProductCreated: () => void;
}

export const CreateProductForm: React.FC<Props> = ({ onProductCreated }) => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    nombre: "",
    precio: 0,
    cantidad: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newData.precio <= 0 || newData.cantidad < 0)
      return alert("Valores no válidos");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        setNewData({ nombre: "", precio: 0, cantidad: 0 });
        onProductCreated(); // Refresca la tabla
      } else {
        const err = await response.json();
        alert(`Error: ${err.message || "No se pudo crear el producto"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Registro de Inventario
      </h3>
      <form
        className="flex flex-wrap md:flex-nowrap gap-3"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          type="text"
          placeholder="Nombre del producto"
          required
          value={newData.nombre}
          onChange={(e) => setNewData({ ...newData, nombre: e.target.value })}
        />
        <input
          className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          type="number"
          step="0.01"
          placeholder="Precio $"
          required
          value={newData.precio || ""}
          onChange={(e) =>
            setNewData({ ...newData, precio: parseFloat(e.target.value) })
          }
        />
        <input
          className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          type="number"
          placeholder="Stock"
          required
          value={newData.cantidad || ""}
          onChange={(e) =>
            setNewData({ ...newData, cantidad: parseInt(e.target.value) })
          }
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? "Añadiendo..." : "Añadir"}
        </button>
      </form>
    </section>
  );
};
