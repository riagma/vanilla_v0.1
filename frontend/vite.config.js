export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: '../backend/public' // para que el backend sirva los estáticos directamente
  }
}
