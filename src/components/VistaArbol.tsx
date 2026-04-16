import { useArbol } from '../context/ArbolContext';
import { NodoComponente } from './NodoComponente';

export const VistaArbol = () => {
  const { arbol, cargando } = useArbol();

  if (cargando) return <p className="cargando">Cargando arbol...</p>;
  if (!arbol) return <p>No se encontro el arbol</p>;

  return (
    <div className="vista-arbol">
      <NodoComponente nodo={arbol.raiz} nivel={0} />
    </div>
  );
};
