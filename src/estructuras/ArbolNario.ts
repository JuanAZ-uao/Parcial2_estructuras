import { NodoArbol } from './NodoArbol';
import type { DatosNodo, NodoSerializado, TipoNodo } from '../types';

export class ArbolNario {
  raiz: NodoArbol;

  constructor(nombreRaiz: string, emailCreador: string) {
    const datosRaiz: DatosNodo = {
      id: crypto.randomUUID(),
      nombre: nombreRaiz,
      tipo: 'carpeta',
      creadoPor: emailCreador,
      fechaCreacion: Date.now(),
    };
    this.raiz = new NodoArbol(datosRaiz);
  }

  insertar(idPadre: string, nombre: string, tipo: TipoNodo, emailCreador: string): NodoArbol {
    const padre = this.raiz.buscarNodo(idPadre);
    if (!padre) throw new Error('Nodo padre no encontrado');
    if (padre.esArchivo()) throw new Error('Un archivo no puede tener hijos');

    const datos: DatosNodo = {
      id: crypto.randomUUID(),
      nombre,
      tipo,
      creadoPor: emailCreador,
      fechaCreacion: Date.now(),
    };

    const nuevoNodo = new NodoArbol(datos);
    padre.agregarHijo(nuevoNodo);
    return nuevoNodo;
  }

  eliminar(id: string): boolean {
    if (this.raiz.datos.id === id) {
      throw new Error('No se puede eliminar la carpeta raiz');
    }

    const padre = this.raiz.buscarPadre(id);
    if (!padre) return false;

    return padre.eliminarHijo(id);
  }

  buscar(id: string): NodoArbol | null {
    return this.raiz.buscarNodo(id);
  }

  serializar(): NodoSerializado {
    const serializarNodo = (nodo: NodoArbol): NodoSerializado => ({
      datos: { ...nodo.datos },
      hijos: nodo.hijos.map(hijo => serializarNodo(hijo)),
    });
    return serializarNodo(this.raiz);
  }

  static deserializar(data: NodoSerializado): ArbolNario {
    const reconstruir = (nodoData: NodoSerializado): NodoArbol => {
      const nodo = new NodoArbol(nodoData.datos);
      nodo.hijos = nodoData.hijos.map(hijoData => reconstruir(hijoData));
      return nodo;
    };

    const arbol = Object.create(ArbolNario.prototype) as ArbolNario;
    arbol.raiz = reconstruir(data);
    return arbol;
  }
}
