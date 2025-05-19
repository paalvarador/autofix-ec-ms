## Historias de Usuario


### Historia de Usuario 0001
#### Status: Done
#### Descripción
Como usuario, quiero crear una migración para poder manejar un catalogo de vehiculos con sus marcas y modelos y asi el usuario tenga una mejor experiencia al crear una cotización.
#### Criterios de Aceptación
- Se debe crear una migración para la tabla `vehicleBrand` con los siguientes campos:
  - `id` string (cadena de texto, no nulo, clave primaria)
  - `name` string (cadena de texto, no nulo y único)
  - `models` VehicleModel (relación uno a muchos)
- Se debe crear una migración para la tabla `vehicleModel` con los siguientes campos:
  - `id` string (cadena de texto, no nulo, clave primaria)
  - `name` string (cadena de texto, no nulo y único)
  - `brandId` string (cadena de texto, no nulo, clave foránea a vehicleBrand)

### Historia de Usuario 0002
#### Descripción
#### Status: New
Como usuario, quiero crear un módulo llamado `catalogs` para poder manejar los catalogos de vehiculos y asi el usuario tenga una mejor experiencia al crear una cotización.
#### Criterios de Aceptación
- Se debe crear un módulo llamado `catalog` que contenga los siguientes archivos:
  - `vehicleBrand.model.ts` (modelo de datos para la tabla vehicleBrand)
  - `vehicleModel.model.ts` (modelo de datos para la tabla vehicleModel)
  - `vehicleBrand.controller.ts` (controlador para manejar las peticiones HTTP relacionadas con vehicleBrand)
  - `vehicleModel.controller.ts` (controlador para manejar las peticiones HTTP relacionadas con vehicleModel)
  - `vehicleBrand.routes.ts` (rutas para manejar las peticiones HTTP relacionadas con vehicleBrand)
  - `vehicleModel.routes.ts` (rutas para manejar las peticiones HTTP relacionadas con vehicleModel)


Eli&Sara@2025