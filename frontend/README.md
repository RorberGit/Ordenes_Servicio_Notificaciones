# Ordenes de Servicio
- Acceso a la API
  . Nuevos registros http://localhost:8000/ordenes/create/
  . Actualizar registros http://localhost:8000/ordenes/update/
  . Listar todos los registros http://localhost:8000/ordenes/getall/
  . Listar todos los registros con paginación http://localhost:8000/ordenes/getall_paginated/
- Formulario Nuevo regisrto
  . Número de Orden de Servicio, Asunto y Fecha de Notificación, son valores suministrados por el usurio
  . Número de Orden es un Input, requerido, con valores con 4 o más digitos
  . Asunto es un TextArea, requerido
  . Fecha de Notificación es un DatePicker, requerido, valor inicial la fecha actual 
  . Notificación que responde, Contenido y Especialidad, sus valores se optinen desde la API
  . Notificación que responde es un select, su valor se escoje si la OS responde una notificación, si no se deja en blanco
  . Contenido es un select y es requerido
  . Especiliadad solo se muestra si Tipo de Contenido su valor es Plano y se convierte en requerida
- Vista de Ordenes de servicio
  . En menú ver ordenes de servicio se mostraran todos los registros de ordenes de servicio
  . Se usara el componente tabla de shadcn/ui
  . Con la llamad a la api para la paginación, mostrando los botones de anterior y siguiente página
  . Se mostrara la página actual y el total de registros
  . Con los botones de eliminar y actualizar en las acciones de cada registro de la tabla

# Tipos de Contenido
  - Acceso API
  . Listar todos los registros http://localhost:8000/tipos-contenido/getall

# Especialidades
  - Acceso API
  . Listar todos los registros http://localhost:8000/especialidades/getall

# Notificaciones
- Acceso a la API
  . Nuevos registros http://localhost:8000/notificaciones/create/
  . Actualizar registros http://localhost:8000/notificaciones/update/
  . Listar todos los registros http://localhost:8000/notificaciones/getall/
  . Listar todos los registros con paginación http://localhost:8000/notificaciones/getall_paginated/