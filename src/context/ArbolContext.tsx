import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { ArbolNario } from '../estructuras/ArbolNario';
import { NodoArbol } from '../estructuras/NodoArbol';
import type { TipoNodo } from '../types';
import { useAutenticacion } from './AuthContext';
import { guardarArbol, cargarArbol } from '../services/firestoreService';

interface ContextoArbolTipo {
  arbol: ArbolNario | null;
  nodoSeleccionado: NodoArbol | null;
  cargando: boolean;
  guardando: boolean;
  error: string | null;
  seleccionarNodo: (id: string) => void;
  crearNodo: (idPadre: string, nombre: string, tipo: TipoNodo) => Promise<void>;
  eliminarNodo: (id: string) => Promise<void>;
}

const ContextoArbol = createContext<ContextoArbolTipo>(null!);

export const useArbol = () => useContext(ContextoArbol);

export const ProveedorArbol = ({ children }: { children: ReactNode }) => {
  const { usuario } = useAutenticacion();
  const [arbol, setArbol] = useState<ArbolNario | null>(null);
  const [nodoSeleccionado, setNodoSeleccionado] = useState<NodoArbol | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const crearArbolNuevo = useCallback((email: string) => {
    const nuevoArbol = new ArbolNario('Raiz', email);
    setArbol(nuevoArbol);
    setNodoSeleccionado(nuevoArbol.raiz);
    return nuevoArbol;
  }, []);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario) return;
      setCargando(true);
      setError(null);
      try {
        const arbolCargado = await cargarArbol(usuario.uid);
        if (arbolCargado) {
          setArbol(arbolCargado);
          setNodoSeleccionado(arbolCargado.raiz);
        } else {
          const nuevo = crearArbolNuevo(usuario.email || 'desconocido');
          try {
            await guardarArbol(usuario.uid, nuevo);
          } catch (errGuardar) {
            console.error('Error al guardar arbol inicial:', errGuardar);
            setError('No se pudo guardar en Firestore. Revisa las reglas de seguridad.');
          }
        }
      } catch (err) {
        console.error('Error al cargar el arbol:', err);
        setError('Error conectando con Firestore: ' + (err instanceof Error ? err.message : String(err)));
        crearArbolNuevo(usuario.email || 'desconocido');
      }
      setCargando(false);
    };
    cargar();
  }, [usuario, crearArbolNuevo]);

  const persistir = useCallback(async () => {
    if (!usuario || !arbol) return;
    setGuardando(true);
    try {
      await guardarArbol(usuario.uid, arbol);
      setError(null);
    } catch (err) {
      console.error('Error al persistir:', err);
      setError('Error al guardar: ' + (err instanceof Error ? err.message : String(err)));
    }
    setGuardando(false);
  }, [usuario, arbol]);

  const seleccionarNodo = (id: string) => {
    if (!arbol) return;
    const nodo = arbol.buscar(id);
    if (nodo) setNodoSeleccionado(nodo);
  };

  const crearNodo = async (idPadre: string, nombre: string, tipo: TipoNodo) => {
    if (!arbol || !usuario) return;
    arbol.insertar(idPadre, nombre, tipo, usuario.email || 'desconocido');
    setVersion(v => v + 1);
    await persistir();
  };

  const eliminarNodo = async (id: string) => {
    if (!arbol) return;
    arbol.eliminar(id);
    if (nodoSeleccionado?.datos.id === id) {
      setNodoSeleccionado(arbol.raiz);
    }
    setVersion(v => v + 1);
    await persistir();
  };

  void version;

  return (
    <ContextoArbol.Provider value={{ arbol, nodoSeleccionado, cargando, guardando, error, seleccionarNodo, crearNodo, eliminarNodo }}>
      {children}
    </ContextoArbol.Provider>
  );
};
