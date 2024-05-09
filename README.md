<h1 align="center">C-Chat</h1>

<p align="center">
  <img src="images/C-Chat_Icon.png" alt="C-Chat-logo" width="120px" height="120px" />
  <br>
  <em>Aplicación de mensajería similar a WhatsApp o Discord
    <br> Hecho con C# y Typescript</em>
  <br>
</p>

<p align="center">
  <a href="https://aromatic-tray-733.notion.site/Anteproyecto-C-Chat-0ca065f5e301446fb2b774a35fcd57ec?pvs=4"><strong>Anteproyecto</strong></a>
  <br><br>
  <strong>Vídeo checkpoint</strong><br>
  <a href="https://youtu.be/orXuOVBVp4I"><img src="https://img.youtube.com/vi/orXuOVBVp4I/hqdefault.jpg" /></a>
</p>

<h2 align="center">Autor</h2>
<p align="center">
  <img src="https://github.com/LuisM0112.png?size=150" alt="autor" /><br>
  Luis Miguel García Sevilla - 2º DAM Tarde
</p>

---

<h2 align="center">
  Boceto de la vista principal
  <img src="images/C-Chat_sketch.webp" alt="Boceto-vista-principal" />
</h2>
<h2 align="center">
  Diagrama de la base de datos
  <img src="images/C-Chat_DBD.webp" alt="Diagrama-base-de-datos" />
</h2>

<h2 align="center">
  Diagrama de flujo de la app
  <img src="images/C-Chat_Flowchart.webp" alt="Diagrama-de-flujo-de-la-app" />
</h2>

# Historico
- 3 de abril de 2024: Creación del repositorio.
- 12 de abril de 2024: Creación del proyecto web y API.
- 29 de abril de 2024 (Backend):
  - Configuración del archivo Program.cs y Añadido JWT.
  - Creado dbContext.
  - Creadas enidades de la base de datos.
  - Endpoints registro e inicio de sesión.
- 30 de abril de 2024 (Backend): Arreglos, mensajes de respuesta y endpoint para eliminar usuarios.
- 3 de mayo de 2024 (Backend y Frontend):
  - Controlador de chat.
  - Endpoints para crear chats, borrarlos, añadir usuarios al chat y salir del chat.
  - Endpoints para obtener la lista de chats y la lista de chats de un usuario.
  - Más mensajes de respuesta.
  - Dtos del resto de entidades.
  - Vista principal
  - Formularios de registro e inicio de sesión.
- 4 de mayo de 2024 (Frontend):
  - Lista de chats.
  - Formulario de creación de chats.
  - Arreglos en los formularios de autenticación.
  - Distribución de los componentes en la interfaz con grid layout.
  - Chats seleccionables.
  - Estilos básicos.
- 5 de mayo de 2024 (Frontend): Formulario para añadir usuarios al chat.
- 8 de mayo de 2024: Actualización del Readme.
- 9 de mayo de 2024: Arreglos al añadir un usuario al chat y actualización del Readme.

---
# C-Chat-Web

Ptoyecto creado con [Angular CLI](https://github.com/angular/angular-cli) versión 17.1.1.

## Servidor de desarrollo

Ejecuta el comando `ng serve` para lanzar el servidor de desarrollo. En la ruta `http://localhost:4200/` se desplegará la web.

## Compilación

Ejecuta el comando `ng build` para compilar el proyecto. Los archivos se almacenarán en el directorio `dist/`.

## Ejecución de test

Ejecuta el comando `ng test` para ejecutar los test unitarios vía [Karma](https://karma-runner.github.io).
