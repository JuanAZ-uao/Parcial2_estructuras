import { useState } from 'react';
import { NodoArbol } from '../estructuras/NodoArbol';
import { useArbol } from '../context/ArbolContext';
import '../styles/arbol.css';

interface PropiedadesNodo {
  nodo: NodoArbol;
  nivel: number;
}

export const NodoComponente = ({ nodo, nivel }: PropiedadesNodo) => {
  const { nodoSeleccionado, seleccionarNodo } = useArbol();
  const [expandido, setExpandido] = useState(true);
  const estaSeleccionado = nodoSeleccionado?.datos.id === nodo.datos.id;

  const manejarClick = () => {
    seleccionarNodo(nodo.datos.id);
  };

  const manejarExpandir = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandido(!expandido);
  };

  return (
    <div className="nodo">
      <div
        className={`nodo-contenido ${estaSeleccionado ? 'seleccionado' : ''}`}
        style={{ paddingLeft: `${nivel * 20 + 8}px` }}
        onClick={manejarClick}
      >
        {nodo.esCarpeta() && (
          <span className="nodo-flecha" onClick={manejarExpandir}>
            {expandido ? '\u25BC' : '\u25B6'}
          </span>
        )}
        <span className="nodo-icono">
          {nodo.esCarpeta() ? '\uD83D\uDCC1' : '\uD83D\uDCC4'}
        </span>
        <span className="nodo-nombre">{nodo.datos.nombre}</span>
      </div>
      {nodo.esCarpeta() && expandido && nodo.hijos.length > 0 && (
        <div className="nodo-hijos">
          {nodo.hijos.map((hijo) => (
            <NodoComponente key={hijo.datos.id} nodo={hijo} nivel={nivel + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
