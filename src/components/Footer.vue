<template>
    <div class="footer-bg rounded-pill shadow-sm">
        <div class="footer mt-5 rounded-pill justify-content-center align-items-center">
    <div class="sociales text-center mt-3">
          <a href="https://www.instagram.com/korolahernz/" class="me-2" target="_blank"><i
              class="fab fa-instagram fa-lg"></i></a>
          <a href="https://github.com/CaroHernz/" class=" me-2" target="_blank"><i
              class="fa-brands fa-github fa-lg"></i></a>
          <a href="https://www.linkedin.com/in/carolinahernandezbarra/" class="" target="_blank"><i
              class="fab fa-linkedin-in fa-lg"></i></a>
    </div>
    <p class="text-center mt-1"><small>© 2025 Carolina Hernández Barra</small></p>
  </div>
    </div>
  
</template>
<script>

</script>
<style scoped>
.footer-bg {
    background-color: var(--bg-primary);
}
.footer p {
    color:var(--bg-primary);
}
.footer {
    padding: 0.5px;
}
.sociales a{
    background-color: none;
    padding: 5px;
    color:var(--bg-primary)
}
.sociales i {
    transition: all 0.3s ease-in;
}
.sociales i:hover{
    color:var(--pagination-active-bg);
    scale:1.2;
}
</style>
