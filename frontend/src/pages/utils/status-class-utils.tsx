// En status-utils.ts (Actualizado)

type EstadoOS =
  | 'Creada'
  | 'En Progreso'
  | 'Casi Vencida'
  | 'Vencida'
  | 'Completada'
  | 'Cancelada'
  | 'default'

export function getStatusBadgeClasses(estado: EstadoOS | string): string {
  switch (estado) {
    case 'Creada':
      // Modo Claro: Fondo muy claro, Texto oscuro.
      // Modo Oscuro: Fondo oscuro, Texto claro/suave.
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'

    case 'En Progreso':
      // Modo Claro: Fondo corporativo (oscuro), Texto blanco.
      // Modo Oscuro: Fondo ligeramente más oscuro, Texto claro.
      return 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100 border-blue-600 dark:border-blue-800'

    case 'Casi Vencida':
      // Modo Claro: Fondo de advertencia claro, Texto de advertencia oscuro.
      // Modo Oscuro: Fondo de advertencia oscuro, Texto claro.
      return 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100 border-amber-300 dark:border-amber-900'

    case 'Vencida':
      // Modo Claro: Fondo de peligro (oscuro), Texto blanco.
      // Modo Oscuro: Fondo de peligro más oscuro, Texto claro.
      return 'bg-red-500 text-white dark:bg-red-700 dark:text-red-100 border-red-600 dark:border-red-800'

    case 'Completada':
      // Modo Claro: Fondo de éxito claro, Texto de éxito oscuro.
      // Modo Oscuro: Fondo de éxito oscuro, Texto claro.
      return 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 border-green-300 dark:border-green-900'

    case 'Cancelada':
      // Modo Claro: Fondo oscuro, Texto blanco.
      // Modo Oscuro: Fondo más oscuro, Texto suave.
      return 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-400 border-gray-800 dark:border-gray-950'

    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300' // Fallback
  }
}
