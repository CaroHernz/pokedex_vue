import { defineStore } from "pinia";
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDarkMode = ref(localStorage.getItem('darkMode') === 'true' || false)
    const currentTheme = computed(()=> isDarkMode.value ? 'dark':'light')

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value
        localStorage.setItem('darkMode', isDarkMode.value)
        applyThemeToDOM()
    }
    const setDarkMode = (value) => {
        isDarkMode.value = value
        localStorage.setItem('darkMode', value)
        applyThemeToDOM()
    }
    const applyThemeToDOM= () => {
        if (isDarkMode.value) {
            document.documentElement.setAttribute('data-theme', 'dark')
            document.body.classList.add('dark-mode')
        } else {
            document.documentElement.removeAttribute('data-theme')
            document.body.classList.remove('dark-mode')
        }
    }
    const initializeTheme = () => {
        applyThemeToDOM()
    }
    return { isDarkMode, currentTheme, toggleDarkMode, setDarkMode, initializeTheme}
})