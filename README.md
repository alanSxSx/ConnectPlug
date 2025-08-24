# 🧪 Testes Automatizados – Controle de Estoque | ConnectPlug

Este projeto contém testes automatizados desenvolvidos com **Cypress** para validar o comportamento do sistema **ConnectPlug**, com foco no módulo de **Controle de Estoque durante o processo de venda**.

---

## ⚠️ Aviso Importante

> Algumas boas práticas de automação **não foram adotadas** devido a **limitações específicas do ambiente**, como a **ausência de acesso direto à API**.

Por isso, os testes foram construídos com foco na funcionalidade e cobertura dos cenários, mesmo que isso tenha exigido maior dependência da interface gráfica (UI) e alguma repetição de código.

Em um ambiente ideal, os testes seriam:
- ✅ Mais isolados da UI, priorizando integração com APIs e banco de dados  
- ✅ Independentes entre si, evitando dependência de estado ou ordem de execução  
- ✅ Mais enxutos e reutilizáveis, com comandos customizados e abstrações  

---

## 🔐 Segurança e Privacidade

Durante toda a construção e execução dos testes:
- 🔒 Nenhuma credencial foi divulgada  
- 🔒 Nenhum dado sensível foi exposto ou compartilhado  
- 🔒 O uso de credenciais foi feito exclusivamente em ambiente controlado, via arquivo local ignorado pelo versionamento  

---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório
git clone https://github.com/alanSxSx/ConnectPlug.git

### 2. Entrar na pasta via CMD ou pelo VSCode
cd ConnectPlug

### 3. Instalar as dependências
npm install

### 4. Configurar as credenciais
Crie um arquivo chamado:
- "cypress.env.json"
na raiz do projeto com o seguinte conteúdo:
{
"COD_EMPRESA": "XXXX",
"USUARIO": "xxxx@xxxx.com",
"SENHA": "XXXXXX"
}

### 5. Para abrir e executar os testes através da interface gráfica do Cypress
npx cypress open

### 6. Para executar os comandos via terminal
npx cypress run

📦 cypress/
 ┣ 📂 e2e/              # Testes end-to-end
 ┣ 📂 fixtures/         # Dados mockados
 ┣ 📂 support/          # Comandos customizados e configurações
 ┗ 📜 cypress.config.js # Configuração principal do Cypress
