Cypress.Commands.add("login", () => {
	const username = Cypress.env("USUARIO");
  const code = Cypress.env("COD_EMPRESA");
  const password = Cypress.env("SENHA");

  if (!username || !password) {
    throw new Error("As credenciais não foram definidas corretamente nas variáveis de ambiente!");
  }
	cy.viewport(1920, 1024);
  const login = () => {

    cy.visit("https://connectplug.com.br/login",);
		// cy.wait(3000)

    cy.get('input[name="login_code"]')
      .should("be.visible")
      .as("codeInput");

		cy.get('input[name="username"]')
      .should("be.visible")
      .as("usernameInput");

    cy.get('input[name="password"]')
      .should("be.visible")
      .as("passwordInput");

    cy.get("@codeInput").clear().type(code);
		cy.get("@usernameInput").clear().type(username);
    cy.get("@passwordInput").clear().type(password, { log: false });

    cy.get("button")
      .contains("Entrar")
      .should("be.visible")
      .should("be.enabled")
      .wait(1000)
      .click({ force: true });

    cy.url().should("include", "/");
  };

  cy.session(username, login);
});


Cypress.Commands.add('criarProduto', (produto) => {
    cy.visit("https://connectplug.com.br/sistema/produtos");
    cy.contains('a', 'Novo Produto').click();
    cy.get('#product-name > [name="name"]').clear().type(produto.name);
    cy.get('[name="code"]').clear().type(produto.codigoProduto);
    cy.get('#select2-id_category-container').click();
    cy.contains('.select2-results__option', produto.categoriaProduto).click();
    cy.get('[name="value"]').clear().type(produto.valorProduto);
    cy.get('#flg_stock_control').select(produto.controleEstoque);
    cy.get('#btn-submit').click();
});

Cypress.Commands.add('tentarCadastrarProdutoSemNome', () => {
  cy.visit("https://connectplug.com.br/sistema/produtos");
  cy.contains('a', 'Novo Produto').click();
  cy.get('#btn-submit').click();
  cy.get('#btn-submit-modal').click();
  cy.get('.sweet-alert > h2')
    .contains('Por favor preencha o nome do produto')
    .should('be.visible');
});

// Command para validar venda sem itens
Cypress.Commands.add('tentarCadastrarVendaSemItens', () => {
  cy.visit("https://connectplug.com.br/sistema/vendas");
  cy.contains('a', 'Nova venda').click();
  cy.contains('button', 'Salvar').click();
  cy.contains('Por favor selecione ao menos um item.').should('be.visible');
});

Cypress.Commands.add('validarEstoqueProduto', (codigo, estoqueEsperado, unidade) => {
	cy.visit("https://connectplug.com.br/sistema/estoque");
	cy.contains('span', 'Verificar').click();
  cy.contains('li', codigo)
    .within(() => {
      cy.get('.stock-detail').should('contain', estoqueEsperado);
      cy.get('.stock-detail small').should('contain', unidade);
    });
});

Cypress.Commands.add('capturarEstoqueProduto', (codigoProduto, unidadeEsperada, alias) => {
	cy.visit("https://connectplug.com.br/sistema/estoque");
	cy.contains('span', 'Verificar').click();
  return cy.contains('li', codigoProduto)
    .within(() => {
      cy.get('.stock-detail').invoke('text').then((texto) => {
        const estoqueAtual = parseFloat(texto.replace(',', '.'));
        cy.wrap(estoqueAtual).as(alias);
      });

      cy.get('.stock-detail small')
        .should('contain', unidadeEsperada);
    });
});

import { dataHoje } from '../support/utils';
Cypress.Commands.add('criarVenda', (venda) => {
  cy.visit("https://connectplug.com.br/sistema/vendas");
  cy.contains('a', 'Nova venda').click();

  // Selecionar vendedor
  cy.get('#select2-id_vendor-container').click();
  cy.get('.select2-results__option').contains(venda.vendedor).click();

  // Selecionar cliente
  cy.get('#select2-id_customer-container').click();
  cy.get('.select2-results__option').contains(venda.cliente).click();

  // Selecionar produto
  cy.get('.product-area-select > .select2 > .selection > .select2-selection').click();
  cy.get('.select2-results__option').contains(venda.produtos[0].codigo).click();

  // Adicionar quantidade
	cy.get('[data-row="1"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control').clear().click();
  cy.get('[data-row="1"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control')
    .clear().type(venda.produtos[0].quantidade);

	cy.get('[name="payment[1][id_payment_method]"]').select(venda.pagamento.metodo);

  // Validar pagamentos
  cy.get('[name="payment[1][value]"]').should('have.value', venda.pagamento.valor_parcela);
  cy.get('[name="payment[1][id_payment_method]"] option:selected')
    .should('contain.text', venda.pagamento.metodo);
  cy.get('[name="payment[1][num_installments]"] option:selected')
    .should('contain.text', `${venda.pagamento.parcelas}x`);
  cy.get('[name="payment[1][installment][1][due_date]"]')
    .should('have.value', dataHoje());
  cy.get('.installments-value').should('have.value', venda.pagamento.valor_parcela);
	// Salvar venda
	cy.contains('button', 'Salvar').click();
});

