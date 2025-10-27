type ButtonAction = 'Crear' | 'Ejecutar' | 'Completar' | 'Cancelar'

export function getButtonClasses(action: ButtonAction): string {
  // Clases base compartidas para un buen look and feel
  const baseClasses =
    'font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out shadow-md'

  switch (action) {
    case 'Crear':
      // Botón neutro/estándar para la creación (Gris)
      return `${baseClasses} bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700`

    case 'Ejecutar':
      // Botón Primario/Main CTA (Azul)
      return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800`

    case 'Completar':
      // Botón de éxito (Verde)
      // Nota: Es secundario en importancia respecto al flujo (ya se está ejecutando), pero indica una acción positiva.
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800`

    case 'Cancelar':
      // Botón Destructivo (Rojo) - Necesita confirmación extra del usuario
      return `${baseClasses} bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800`

    default:
      // Fallback
      return `${baseClasses} bg-gray-400 text-gray-800`
  }
}
