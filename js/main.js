import ui from "./ui.js"
import api from "./api.js"

const pensamentosSet = new Set()

async function adicionarChavesAoPensamento() {
  try {
    const pensamentos = await api.buscarPensamentos()
    pensamentos.forEach(pensamento => {
      const chave = `${pensamento.conteudo.trim().toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`
      pensamentosSet.add(chave)
    })
  } catch (error) {
    alert('Erro ao adicionar chaves aos pensamentos')
    throw error
  }
}

const regexConteudo = /^[A-Za-z !.,\s]{10,}$/
const regexAutoria = /^[A-Za-z @\s]{3,}$/

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos()
  adicionarChavesAoPensamento()

  const formularioPensamento = document.getElementById("pensamento-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBusca = document.getElementById("campo-busca")
  

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
  botaoCancelar.addEventListener("click", manipularCancelamento)
  inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("pensamento-id").value
  const conteudo = document.getElementById("pensamento-conteudo").value
  const autoria = document.getElementById("pensamento-autoria").value
  const data = document.getElementById("pensamento-data").value

  if (!validarConteudo(conteudo)) {
    alert('É permitida a inclusão de pensamentos com no mínimo 10 caracteres e apenas letras e espaços.')
    return
  }
  if (!validarAutoria(autoria)) {
    alert('É permitida a inclusão de autoria com no mínimo 15 caracteres e apenas letras  e espaços.')
    return
  }

if (!validarData(data)) {
    alert("Data inválida. Favor, não inserir datas futuras.")
    return
  }
  

  const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`

  if (pensamentosSet.has(chaveNovoPensamento)) {
    alert("Pensamento já existe.")
    return
  }


  
    try {
      if (id) {
        await api.editarPensamento({ id, conteudo, autoria, data })
      } else {
        await api.salvarPensamento({ conteudo, autoria, data })
      }
      
      ui.renderizarPensamentos()
    } catch {
      alert("Erro ao salvar pensamento")
    }
}


function manipularCancelamento() {
  ui.limparFormulario()
}


async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value
  try {
    const pensamentoFiltrados = await api.buscarPensamentosPorTermo(termoBusca)
    ui.renderizarPensamentos(pensamentoFiltrados)
    
  } catch (error) {
    alert("Erro ao buscar pensamentos")
  }
}

function validarData(data) {
  const dataAtual = new Date()
  const dataInserida = new Date(data)
  return dataInserida <= dataAtual

  
}