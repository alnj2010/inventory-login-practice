import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { useAuth } from "../Auth/AuthProvider";
import { API_URL } from "../Auth/ApiURL";
import { useConfig } from "../Context/ConfigContext";
import { SalesModal } from "../Components/SalesModal";
import { CreateProductForm } from "../Components/CreateProductForm"; // Importamos el nuevo componente

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function ProductsList() {
  const { getAccessToken, user } = useAuth();
  const { formatBs } = useConfig();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    nombre: "",
    precio: 0,
    cantidad: 0,
  });

  useEffect(() => {
    fetchProductos();
  }, [page, rowsPerPage]);

  const fetchProductos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/products?page=${page}&limit=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      const json = await response.json();
      setProductos(json.body.items);
      setTotal(json.body.total);
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const startEditing = (p: Producto) => {
    setEditingId(p.id);
    setEditFormData({
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad,
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setEditingId(null);
        fetchProductos();
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProducto = async (id: number) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (response.ok) fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 antialiased text-slate-800">
      {/* FORMULARIO SEPARADO */}
      {user?.role === "ADMIN" && (
        <CreateProductForm onProductCreated={fetchProductos} />
      )}

      {/* TABLA PROFESIONAL */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Precio ($)</th>
              <th className="px-6 py-4">Precio (Bs.)</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {productos.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4 font-medium">
                  {editingId === p.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-slate-900 outline-none text-sm"
                      value={editFormData.nombre}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          nombre: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.nombre
                  )}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-20 text-sm"
                      value={editFormData.precio}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          precio: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : (
                    `$${p.precio.toFixed(2)}`
                  )}
                </td>

                <td className="px-6 py-4 font-bold text-emerald-600">
                  {formatBs(
                    editingId === p.id ? editFormData.precio : p.precio,
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-16 text-sm"
                      value={editFormData.cantidad}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          cantidad: parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.cantidad > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.cantidad} uds
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 items-center">
                    {editingId === p.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(p.id)}
                          className="text-emerald-600 font-bold hover:text-emerald-700"
                        >
                          Listo
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-slate-400 font-bold hover:text-slate-600 text-lg"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm"
                        >
                          Vender
                        </button>
                        {user?.role === "ADMIN" && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(p)}
                              className="text-slate-400 hover:text-blue-600 text-xs font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteProducto(p.id)}
                              className="text-slate-400 hover:text-rose-600 text-xs font-semibold"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-slate-50 border-t border-slate-100 px-4">
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) =>
              setRowsPerPage(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[5, 10]}
            labelRowsPerPage="Filas:"
          />
        </div>
      </div>

      {selectedProduct && (
        <SalesModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            setSelectedProduct(null);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}
