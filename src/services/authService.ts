import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { autenticacion } from '../config/firebase';

export const registrar = (correo: string, contrasena: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(autenticacion, correo, contrasena);
};

export const iniciarSesion = (correo: string, contrasena: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(autenticacion, correo, contrasena);
};

export const cerrarSesion = (): Promise<void> => {
  return signOut(autenticacion);
};
