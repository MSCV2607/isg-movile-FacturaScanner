import { useCallback, useEffect, useState } from 'react';

import { container } from '@core/di/container';
import { Empresa } from '@domain/entities/Empresa';
import { normalizarTexto } from '@domain/rules/texto';

const MENSAJE_SIN_EMPRESAS = 'No se pudo cargar la lista de empresas. Revisá tu conexión y tocá Registrarme para reintentar.';
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Estado del formulario de registro: empresa (de la api) y datos del usuario nuevo. */
export function useRegistro() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresa, setEmpresa] = useState('');
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [errorEmpresa, setErrorEmpresa] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorRepetir, setErrorRepetir] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarEmpresas = useCallback(async (): Promise<Empresa[]> => {
    try {
      const lista = await container.obtenerEmpresas.ejecutar();
      setEmpresas(lista);
      setErrorEmpresa('');
      return lista;
    } catch {
      setEmpresas([]);
      setErrorEmpresa(MENSAJE_SIN_EMPRESAS);
      return [];
    }
  }, []);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  function cambiarEmpresa(texto: string) {
    setEmpresa(texto);
    setErrorEmpresa('');
    setErrorGeneral('');
  }

  function cambiarNombre(texto: string) {
    setNombre(texto);
    setErrorNombre('');
    setErrorGeneral('');
  }

  function cambiarUsuario(texto: string) {
    setUsuario(texto);
    setErrorUsuario('');
    setErrorGeneral('');
  }

  function cambiarEmail(texto: string) {
    setEmail(texto);
    setErrorEmail('');
    setErrorGeneral('');
  }

  function cambiarPassword(texto: string) {
    setPassword(texto);
    setErrorPassword('');
    setErrorGeneral('');
  }

  function cambiarRepetir(texto: string) {
    setRepetir(texto);
    setErrorRepetir('');
    setErrorGeneral('');
  }

  /** Valida el formulario y pide el alta. Devuelve `true` si el servidor la recibió. */
  async function registrar(): Promise<boolean> {
    if (enviando) return false;
    setErrorGeneral('');
    setEnviando(true);
    try {
      const lista = empresas.length > 0 ? empresas : await cargarEmpresas();

      const buscada = normalizarTexto(empresa);
      const elegida = lista.find((item) => normalizarTexto(item.nombre) === buscada);

      let valido = true;
      if (!elegida) {
        if (lista.length > 0) setErrorEmpresa(buscada === '' ? 'Elegí tu empresa' : 'Elegí una empresa de la lista');
        valido = false;
      }
      if (nombre.trim() === '') {
        setErrorNombre('Ingresá tu nombre');
        valido = false;
      }
      if (usuario.trim().length < 3) {
        setErrorUsuario('El usuario debe tener al menos 3 caracteres');
        valido = false;
      }
      if (!FORMATO_EMAIL.test(email.trim())) {
        setErrorEmail('Ingresá un correo válido');
        valido = false;
      }
      if (password.length < 6) {
        setErrorPassword('La contraseña debe tener al menos 6 caracteres');
        valido = false;
      }
      if (repetir !== password) {
        setErrorRepetir('Las contraseñas no coinciden');
        valido = false;
      }
      if (!valido || !elegida) return false;

      setEmpresa(elegida.nombre);
      const resultado = await container.registrarUsuario.ejecutar({
        empresa: elegida,
        nombre: nombre.trim(),
        usuario: usuario.trim(),
        email: email.trim(),
        password,
      });
      if (!resultado.exito) {
        setErrorGeneral(resultado.mensaje);
        return false;
      }
      setMensajeExito(resultado.mensaje);
      return true;
    } finally {
      setEnviando(false);
    }
  }

  return {
    empresa,
    cambiarEmpresa,
    errorEmpresa,
    empresas: empresas.map((item) => item.nombre),
    nombre,
    cambiarNombre,
    errorNombre,
    usuario,
    cambiarUsuario,
    errorUsuario,
    email,
    cambiarEmail,
    errorEmail,
    password,
    cambiarPassword,
    errorPassword,
    repetir,
    cambiarRepetir,
    errorRepetir,
    errorGeneral,
    mensajeExito,
    enviando,
    registrar,
  };
}
