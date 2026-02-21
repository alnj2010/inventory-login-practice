import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { useAuth } from "../Auth/AuthProvider";
import { APi_URL } from "../Auth/ApiURL";
import "../Stily/ProductsList.css";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function ProductsList() {
  const { getAccessToken } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchProductos();
  }, [page, rowsPerPage]);

  const fetchProductos = async () => {
    try {
      const response = await fetch(
        `${APi_URL}/products?page=${page}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );
      const json = await response.json();
      setProductos(json.body.items);
      setTotal(json.body.total);
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reiniciar a la primera página cuando cambia el límite
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.cantidad}</td>
            </tr>
          ))}
        </tbody>
        {/* LA PAGINACIÓN DEBE IR DENTRO DE LA TABLA O USAR UN COMPONENTE DIFERENTE */}
        <tfoot>
          <tr>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              // Agregamos 'component' para que no pelee con el HTML
              component="td"
            />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
