<div align=center>

<img src="public/ultraball_icon.png" alt= "Pokédex - Vue" width="90" height="90">

# Pokédex con Vue.js
Aplicación web que consume PokeAPI para mostrar información de Pokémon, con funcionalidades de búsqueda y paginación.

<img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vuedotjs" > 
<img src="https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap" > 
<img src="https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite" >

</div>

## Características
🔍 **Búsqueda inteligente:** Encuentra Pokémon por nombre (coincidencias exactas y parciales)

📄 **Paginación:** Navega a través de todos los Pokémon con paginación responsive

🎨 **Diseño responsive:** Interfaz adaptable a dispositivos móviles y desktop

🃏 **Tarjetas interactivas:** Información detallada con stats, tipos e imágenes

⚡ **Rendimiento optimizado:** Carga rápida gracias a Vite

🎯 **Búsqueda en tiempo real:** Con sistema debounce para mejor performance

## 🚀 Instalación 
### Prerrequisitos
Antes de instalar el proyecto, asegúrate de tener:
* **Node.js** (versión 16 o superior)
* **npm o yarn** como gestor de paquetes
* **Git** para clonar el repositorio

### Instalación
Sigue estos pasos para instalar y ejecutar el proyecto:
1. **Clonar el repositorio**
```
git clone https://github.com/CaroHernz/pokedex_vue
cd pokedex-vue
```
2. **Instalar dependencias**
````
npm install
````
3. **Ejecutar en modo desarrollo**
```
npm run dev
```
4. **Abrir en el navegador**
La aplicación estará disponible en: ` http://localhost:3000 `

## 📂 Estructura del proyecto

````
pokedex-vue/
├── src/
│   ├── components/
│   │   ├── Footer.vue
│   │   ├── Navbar.vue
│   │   └── PokemonCard.vue    # Componente de tarjeta de Pokémon
│   ├── router/
│   │   └── index.js 
│   ├── services/
│   │   └── pokeapi.js         # Servicio para API calls   
│   ├── views/
│   │   └── PokemonPage.vue    # Página principal
│   ├── App.vue                # Componente principal
│   ├── style.css              
│   └── main.js                # Punto de entrada
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
````

### 🎨 Tecnologías utilizadas
* **Vue.js 3** - Framework principal
* **Vite** - Herramienta de build y desarrollo
* **Bootstrap 5** - Framework CSS
* **Font Awesome** - Iconografía
* **PokeAPI** - API de datos de Pokémon

#### Creado por:
<p align= center>
  <a href="https://github.com/CaroHernz">Carolina Hernández</a>

**⭐ ¡Si te gusta este proyecto, dale una estrella en GitHub!**

</p>