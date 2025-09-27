<template>
    <div class="dark-mode-toggle">
        <button class="btn btn-toggle btn-outline-light border-0 d-flex align-items-center"
            @click="toggleTheme"
            :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
            <i class="fas fa-xl" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
        </button>
    </div>
</template>

<script setup>
import { useThemeStore } from '../stores/themeStore';
import { computed } from 'vue';

const themeStore = useThemeStore()

// Crear una computed property para reactividad
const isDarkMode = computed(() => themeStore.isDarkMode)

const toggleTheme = () => {
  themeStore.toggleDarkMode()
}
</script>

<style scoped>
.dark-mode-toggle .btn {
    position: absolute;
    top: 5rem;
    right: 20%;
    width: auto;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
    background: rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
}

@media (max-width: 500px) {
    .dark-mode-toggle .btn {
        right: 10%;
    }
}

.dark-mode-toggle .btn:hover {
    transform: scale(1.05);
    background: rgba(0,0,0,0.2);
}

.dark-mode-toggle .fa-sun {
    color: #ffd43b;
}

.dark-mode-toggle .fa-moon {
    color: #006aff;
}
</style>