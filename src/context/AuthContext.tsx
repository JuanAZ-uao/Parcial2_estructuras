import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { autenticacion } from '../config/firebase';
import * as authService from '../services/authService';

interface ContextoAutenticacionTipo {
  usuario: User | null;
  cargando: boolean;
  registrar: (correo: string, contrasena: string) => Promise<void>;
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const ContextoAutenticacion = createContext<ContextoAutenticacionTipo>(null!);

export const useAutenticacion = () => useContext(ContextoAutenticacion);

export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cancelar = onAuthStateChanged(autenticacion, (usuarioActual) => {
      setUsuario(usuarioActual);
      setCargando(false);
    });
    return cancelar;
  }, []);

  const registrar = async (correo: string, contrasena: string) => {
    await authService.registrar(correo, contrasena);
  };

  const iniciarSesion = async (correo: string, contrasena: string) => {
    await authService.iniciarSesion(correo, contrasena);
  };

  const cerrarSesion = async () => {
    await authService.cerrarSesion();
  };

  return (
    <ContextoAutenticacion.Provider value={{ usuario, cargando, registrar, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};
