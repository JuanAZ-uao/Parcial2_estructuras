import { useState } from 'react';
import { Header } from './Header';
import { VistaArbol } from './VistaArbol';
import { FormularioNodo } from './FormularioNodo';
import { useArbol } from '../context/ArbolContext';
import '../styles/layout.css';

export const Layout = () => {
  const { nodoSeleccionado, eliminarNodo, guardando, error } = useArbol();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const manejarEliminar = async () => {
    if (!nodoSeleccionado) return;
    if (nodoSeleccionado.datos.id === undefined) return;

    const confirmado = window.confirm(
      `Eliminar "${nodoSeleccionado.datos.nombre}"?`
    );
    if (!confirmado) return;

    try {
      await eliminarNodo(nodoSeleccionado.datos.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const puedeCrear = nodoSeleccionado?.esCarpeta() ?? false;
  const puedeEliminar = nodoSeleccionado !== null &&
    nodoSeleccionado.datos.tipo !== undefined;

  return (
    <div className="layout">
      <Header />
      <aside className="barra-lateral">
        <div className="barra-herramientas">
          <button
            className="boton-accion"
            onClick={() => setMostrarFormulario(true)}
            disabled={!puedeCrear || guardando}
          >
            + Nuevo
          </button>
          <button
            className="boton-accion boton-eliminar"
            onClick={manejarEliminar}
            disabled={!puedeEliminar || guardando}
          >
            Eliminar
          </button>
          {guardando && <span className="indicador-guardado">Guardando...</span>}
        </div>
        <VistaArbol />
        {error && <p className="error" style={{ padding: '12px', fontSize: '12px' }}>{error}</p>}
      </aside>
      <main className="contenido-principal">
        {nodoSeleccionado ? (
          <div className="detalle-nodo">
            <h2>{nodoSeleccionado.datos.nombre}</h2>
            <div className="detalle-info">
              <p><strong>Tipo:</strong> {nodoSeleccionado.datos.tipo === 'carpeta' ? 'Carpeta' : 'Archivo'}</p>
              <p><strong>Creado por:</strong> {nodoSeleccionado.datos.creadoPor}</p>
              <p><strong>Fecha de creacion:</strong> {new Date(nodoSeleccionado.datos.fechaCreacion).toLocaleString()}</p>
              {nodoSeleccionado.esCarpeta() && (
                <p><strong>Elementos hijos:</strong> {nodoSeleccionado.hijos.length}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="sin-seleccion">Selecciona un elemento del arbol</p>
        )}
      </main>
      {mostrarFormulario && (
        <FormularioNodo alCerrar={() => setMostrarFormulario(false)} />
      )}
    </div>
  );
};
