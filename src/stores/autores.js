// stores/autor.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import AutorApi from '@/api/autores'
const autorApi = new AutorApi()

export const useAutorStore = defineStore('autor', () => {
  const autores = ref([])
  const meta = ref({
    page: 1,
    page_size: 10,
    total_pages: 1,
  })

  async function getAutores(page = meta.value.page) {
    try {
      const data = await autorApi.buscarTodosOsAutores(page)
      console.log("Autores", data)
      autores.value = data.results
      meta.value.page = data.page
      meta.value.page_size = data.page_size
      meta.value.total_pages = data.total_pages
    } catch (error) {
      console.error("Erro ao buscar autores:", error)
    }
  }

  async function salvarAutor(autor) {
    if (autor.id) {
      await autorApi.atualizarAutor(autor)
    } else {
      await autorApi.adicionarAutor(autor)
    }
    await getAutores()
  }

  async function excluirAutor(id) {
    await autorApi.excluirAutor(id)
    await getAutores()
  }

  async function paginaAnterior() {
    if (meta.value.page > 1) {
      meta.value.page--
      await getAutores()
    }
  }

  async function proximaPagina() {
    if (meta.value.page < meta.value.total_pages) {
      meta.value.page++
      await getAutores()
    }
  }

  return {
    autores,
    meta,
    getAutores,
    salvarAutor,
    excluirAutor,
    paginaAnterior,
    proximaPagina,
  }
})
