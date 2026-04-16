import { useState, type FormEvent } from 'react';
import { useArbol } from '../context/ArbolContext';
import type { TipoNodo } from '../types';
import '../styles/formulario.css';

interface PropiedadesFormulario {
  alCerrar: () => void;
}

export const FormularioNodo = ({ alCerrar }: PropiedadesFormulario) => {
  const { nodoSeleccionado, crearNodo } = useArbol();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoNodo>('carpeta');
  const [error, setError] = useState('');

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nodoSeleccionado) {
      setError('Selecciona una carpeta padre');
      return;
    }

    if (nodoSeleccionado.esArchivo()) {
      setError('No se puede agregar elementos dentro de un archivo');
      return;
    }

    try {
      await crearNodo(nodoSeleccionado.datos.id, nombre, tipo);
      setNombre('');
      alCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    }
  };

  return (
    <div className="formulario-fondo" onClick={alCerrar}>
      <div className="formulario-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Crear nuevo elemento</h3>
        <p className="formulario-padre">
          Dentro de: <strong>{nodoSeleccionado?.datos.nombre}</strong>
        </p>
        <form onSubmit={manejarEnvio}>
          <div className="campo">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="campo">
            <label>Tipo</label>
            <div className="selector-tipo">
              <button
                type="button"
                className={`boton-tipo ${tipo === 'carpeta' ? 'activo' : ''}`}
                onClick={() => setTipo('carpeta')}
              >
                Carpeta
              </button>
              <button
                type="button"
                className={`boton-tipo ${tipo === 'archivo' ? 'activo' : ''}`}
                onClick={() => setTipo('archivo')}
              >
                Archivo
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="formulario-acciones">
            <button type="button" className="boton-cancelar" onClick={alCerrar}>Cancelar</button>
            <button type="submit" className="boton-primario">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
};
