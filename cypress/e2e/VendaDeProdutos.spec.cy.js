import { dataHoje } from "../support/utils";

describe("Fluxo de venda de produtos", () => {
  beforeEach(function () {
		cy.viewport(1920, 1080);
    cy.fixture("messages.json").as("messages");
    cy.fixture("produtoNoControleEstoque.json").as("produtoNoControleEstoque");
    cy.fixture("produtoControleEstoque.json").as("produtoControlaEstoque");
    cy.fixture("vendaprodutoNoControleEstoque.json").as(
      "vendaprodutoNoControleEstoque"
    );
    cy.fixture("vendaprodutoControlaEstoque.json").as(
      "vendaprodutoControlaEstoque"
    );
		cy.fixture("vendaProdutoControlaEstoqueQtdeZero.json").as(
      "vendaProdutoControlaEstoqueQtdeZero"
    );
    cy.login();
  });

  it("Não deve deixar cadastrar produto sem nome", () => {
    cy.tentarCadastrarProdutoSemNome();
  });

  it("Deve cadastrar um novo produto que controla estoque com sucesso", function () {
    cy.criarProduto(this.produtoControlaEstoque);
    cy.get(".slideInDown")
      .contains(".alert", this.messages.mensagemProdutoCadastradoComSucesso)
      .should("be.visible");
  });

  it("Deve cadastrar um novo produto que não controla estoque com sucesso", function () {
    cy.criarProduto(this.produtoNoControleEstoque);
    cy.get(".slideInDown")
      .contains(".alert", this.messages.mensagemProdutoCadastradoComSucesso)
      .should("be.visible");
  });

  it("Não deve deixar cadastrar venda sem itens", () => {
    cy.tentarCadastrarVendaSemItens();
  });

  it("Deve criar uma venda de produto que movimenta o estoque", function () {
    // Capturar o saldo inicial do produto
    cy.capturarEstoqueProduto(
      this.produtoControlaEstoque.codigoProduto,
      this.produtoControlaEstoque.unidade,
      "saldoInicialProduto439"
    );
    // Criar a venda
    cy.criarVenda(this.vendaprodutoControlaEstoque.venda);
    // Validar o estoque após a venda
		const quantidadeEstoque439 = Number(this.vendaprodutoNoControleEstoque.venda.produtos[0].quantidade.replace(',', '.'));
    cy.get("@saldoInicialProduto439").then((saldo) => {
      cy.validarEstoqueProduto(
        this.produtoControlaEstoque.codigoProduto,
        saldo - quantidadeEstoque439,
        this.produtoControlaEstoque.unidade
      );
    });
  });

	it("Deve criar uma venda de produto que nao movimenta o estoque", function () {
    // Captura o saldo inicial do produto
    cy.capturarEstoqueProduto(
      this.produtoNoControleEstoque.codigoProduto,
      this.produtoNoControleEstoque.unidade,
      "saldoInicialProduto440"
    );
    // Cria a venda
    cy.criarVenda(this.vendaprodutoNoControleEstoque.venda);
		cy.get('.slideInDown').contains('Ok! Venda inserida com sucesso.');
    // Verifica se o estoque continua o mesmo, pois esse produto não movimenta o estoque.
    cy.get("@saldoInicialProduto440").then((saldo) => {
      cy.validarEstoqueProduto(
        this.produtoNoControleEstoque.codigoProduto,
        saldo,
        this.produtoNoControleEstoque.unidade
      );
    });
  });

	it("Deve criar uma venda de produto que movimenta o estoque com a quantidade ZERO", function () {
    // Capturar o saldo inicial do produto
    cy.capturarEstoqueProduto(
      this.produtoControlaEstoque.codigoProduto,
      this.produtoControlaEstoque.unidade,
      "saldoInicialProduto439"
    );
    // Criar a venda
    cy.criarVenda(this.vendaProdutoControlaEstoqueQtdeZero.venda);
		cy.get('.slideInDown').contains('Ok! Venda inserida com sucesso.');
    // Validar o estoque após a venda
    cy.get("@saldoInicialProduto439").then((saldo) => {
      cy.validarEstoqueProduto(
        this.produtoControlaEstoque.codigoProduto,
        saldo - 1, //Menos um porquê quando a quantidade é zero, o sistema entende como 1
        this.produtoControlaEstoque.unidade
      );
    });
  });

	it("Deve criar uma venda com produtos que movimenta e que não movimenta estoque juntos", function () {
		// Captura o saldo inicial dos produtos
    cy.capturarEstoqueProduto(
      this.produtoControlaEstoque.codigoProduto,
      this.produtoControlaEstoque.unidade,
      "saldoInicialProduto439"
    );
    cy.capturarEstoqueProduto(
      this.produtoNoControleEstoque.codigoProduto,
      this.produtoNoControleEstoque.unidade,
      "saldoInicialProduto440"
    );
		// Cria a venda
    cy.visit("https://connectplug.com.br/sistema/vendas");
    cy.contains("a", "Nova venda").click();

    // Selecionar vendedor
    cy.get("#select2-id_vendor-container").click();
    cy.get(".select2-results__option")
      .contains(this.vendaprodutoNoControleEstoque.venda.vendedor)
      .click();

    // Selecionar cliente
    cy.get("#select2-id_customer-container").click();
    cy.get(".select2-results__option")
      .contains(this.vendaprodutoNoControleEstoque.venda.cliente)
      .click();

    // Selecionar produto
    cy.get(".product-area-select > .select2 > .selection > .select2-selection")
      .first()
      .click();
    cy.get(".select2-results__option")
      .contains(this.vendaprodutoNoControleEstoque.venda.produtos[0].codigo)
      .click();
    // Adicionar quantidade
		cy.get('[data-row="1"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control').clear().click();
    cy.get('[data-row="1"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control')
      .clear().type(this.vendaprodutoNoControleEstoque.venda.produtos[0].quantidade);

    cy.contains("button", "Adicionar mais produtos").click();

    // Selecionar outro produto
    cy.get(".product-area-select > .select2 > .selection > .select2-selection")
      .last()
      .click();
    cy.get(".select2-results__option")
      .contains(this.vendaprodutoControlaEstoque.venda.produtos[0].codigo)
      .click();

		//Adicionar quantidade
		cy.get('[data-row="2"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control').clear().click();
    cy.get('[data-row="2"] > .col-xs-11 > :nth-child(1) > .amount-area > .input-group > .form-control')
		.clear().type(this.vendaprodutoControlaEstoque.venda.produtos[0].quantidade);

    cy.get('[name="payment[1][id_payment_method]"]').select(
      this.vendaprodutoNoControleEstoque.venda.pagamento.metodo
    );

		const valor1 = Number(this.vendaprodutoNoControleEstoque.venda.pagamento.valor_parcela.replace(',', '.'));
		const valor2 = Number(this.vendaprodutoControlaEstoque.venda.pagamento.valor_parcela.replace(',', '.'));

    // Validar pagamentos
    cy.get('[name="payment[1][value]"]').should("have.value", valor1 + valor2 + ',00');
    cy.get('[name="payment[1][id_payment_method]"] option:selected').should(
      "contain.text",
      this.vendaprodutoNoControleEstoque.venda.pagamento.metodo
    );
    cy.get('[name="payment[1][num_installments]"] option:selected').should(
      "contain.text",
      `${this.vendaprodutoNoControleEstoque.venda.pagamento.parcelas}x`
    );
    cy.get('[name="payment[1][installment][1][due_date]"]').should(
      "have.value",
      dataHoje()
    );
    cy.get(".installments-value").should("have.value", valor1 + valor2 + ',00');
    // Salvar venda
    cy.contains("button", "Salvar").click();
		// Verifica o saldo dos produtos
    cy.get("@saldoInicialProduto440").then((saldoInicialProduto440) => {
      cy.validarEstoqueProduto(
        this.produtoNoControleEstoque.codigoProduto,
        saldoInicialProduto440,
        this.produtoNoControleEstoque.unidade
      );
    });
		// Verifica o saldo do produto que controla estoque
		const quantidadeEstoque439 = Number(this.vendaprodutoNoControleEstoque.venda.produtos[0].quantidade.replace(',', '.'));
    cy.get("@saldoInicialProduto439").then((saldoInicialProduto439) => {
      cy.validarEstoqueProduto(
        this.produtoControlaEstoque.codigoProduto,
        saldoInicialProduto439 -
        quantidadeEstoque439,
        this.produtoControlaEstoque.unidade
      );
    });
  });

  it("Deve excluir os dados gerados nas vendas", function () {
    cy.visit("https://connectplug.com.br/sistema/vendas");
		cy.get('.check_all').click();
		cy.contains('a', 'Cancelar').click();
		cy.contains('button', 'Excluir mesmo assim').click();
		cy.get('.slideInDown')
    .contains('.alert', this.messages.mensagemVendaRemovidaComSucessoAll)
    .should('be.visible');
  });

	it("Deve excluir os produtos", function () {
    cy.visit("https://connectplug.com.br/sistema/produtos");
		cy.get('.check_all').click();
		cy.contains('a', 'Excluir').click();
		cy.contains('button', 'Excluir mesmo assim').click();
		cy.get('.slideInDown')
    .contains('.alert', this.messages.mensagemProdutoRemovidoComSucesso)
    .should('be.visible');
  });

});
