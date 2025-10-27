import log from 'loglevel'

const isDev = import.meta.env.DEV

// Configura niveles de log
log.setLevel(isDev ? 'debug' : 'warn')

const color = {
  debug: 'color: gray',
  info: 'color: blue',
  warn: 'color: orange',
  error: 'color: red; font-weight: bold',
}

// Función para logs bonitos en consola
const logWithStyle = (level: keyof typeof color, ...args: unknown[]) => {
  if (isDev) {
    console[level](`%c[MyApp]`, color[level], ...args)
  }
}

// Logger principal
export const logger = {
  debug: (...args: unknown[]) => {
    log.debug(...args)
    logWithStyle('debug', ...args)
  },
  info: (...args: unknown[]) => {
    log.info(...args)
    logWithStyle('info', ...args)
  },
  warn: (...args: unknown[]) => {
    log.warn(...args)
    logWithStyle('warn', ...args)
  },
  error: (...args: unknown[]) => {
    log.error(...args)
    logWithStyle('error', ...args)
  },
}
