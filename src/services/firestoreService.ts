import { doc, getDoc, setDoc } from 'firebase/firestore';
import { baseDatos } from '../config/firebase';
import { ArbolNario } from '../estructuras/ArbolNario';
import type { NodoSerializado } from '../types';

export const guardarArbol = async (idUsuario: string, arbol: ArbolNario): Promise<void> => {
  const serializado = arbol.serializar();
  await setDoc(doc(baseDatos, 'arboles', idUsuario), {
    arbol: serializado,
    ultimaModificacion: Date.now(),
  });
};

export const cargarArbol = async (idUsuario: string): Promise<ArbolNario | null> => {
  const documento = await getDoc(doc(baseDatos, 'arboles', idUsuario));
  if (!documento.exists()) return null;

  const datos = documento.data();
  return ArbolNario.deserializar(datos.arbol as NodoSerializado);
};
