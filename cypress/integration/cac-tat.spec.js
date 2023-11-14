/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

    const valoresObrigatorios = {};

    beforeEach(() => {
        cy.visit('./src/index.html');
        valoresObrigatorios.nome = 'Everton';
        valoresObrigatorios.sobrenome = 'Souza';
        valoresObrigatorios.email = 'souza@gmail.com';
        valoresObrigatorios.mensagem = 'Só testando';
    });

    it('verifica o título da aplicação', function() {
        cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('#firstName').type('Everton');
        cy.get('#lastName').type('Souza');
        cy.get('#email').type('souza@gmail.com');
        cy.get('#open-text-area').type('Só testando'); // , {delay: 0}atrasa a digitação é interessante para testar funcionalidades com tempo máximo
        cy.contains('.button', 'Enviar').click(); // ('button[type="submit"]') opção de seletor
        cy.get('.success').should('be.visible');
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type('Everton');
        cy.get('#lastName').type('Souza');
        cy.get('#email').type('souza.gmail.com');
        cy.get('#open-text-area').type('Só testando Só testando Só testando Só testando Só testando'); //, {delay: 0}atrasa a digitação é interessante para testar funcionalidades com tempo máximo
        cy.contains('.button', 'Enviar').click();
        cy.get('.error').should('be.visible');
    });

    it('tenta preencher o campo de telefone com valores não numéricos', function() {
        cy.get('#phone').type('abc!@#def&*.,').should('be.empty');
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Everton');
        cy.get('#lastName').type('Souza');
        cy.get('#email').type('souza@gmail.com');
        cy.get('#phone-checkbox').check();
        cy.get('#open-text-area').type('Só testando');
        cy.contains('.button', 'Enviar').click();
        cy.get('#phone').should('be.empty');
        cy.get('.error').should('be.visible');
    });

    it('preenche e limpa os campos de nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
            .type('Everton')
            .should('have.value', 'Everton');
        cy.get('#lastName')
            .type('Souza')
            .should('have.value', 'Souza');
        cy.get('#email')
            .type('souza@gmail.com')
            .should('have.value', 'souza@gmail.com'); 
        cy.get('#phone')
            .type('8199224886')
            .should('have.value', '8199224886'); // Seria possível encadear o .clear e a checagem logo depois

        cy.get('#firstName')
            .clear()        // .clear() limpa o input o um textarea
            .should('be.empty'); 
        cy.get('#lastName')
            .clear()
            .should('be.empty');
        cy.get('#email')
            .clear()
            .should('be.empty'); 
        cy.get('#phone')
            .clear()
            .should('be.empty');
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.contains('.button', 'Enviar').click();
        cy.get('.error').should('be.visible');
    });

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit(valoresObrigatorios);
        cy.get('.success').should('be.visible');
    });

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube');
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria');
    });

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog');
    });

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked');
    });

    it('marca o tipo de atendimento', function(){
        cy.get('input[type="radio"]') // seleciona todos os radio buttons de uma vez
            .should('have.length', 3)
            .each(function(radio){  // navega entre cada radio button
                cy.wrap(radio).check();  // nesse caso o .wrap funciona igual ao .get
                cy.wrap(radio).should('be.checked');
                // cy.get(radio).check();
                // cy.get(radio).should('be.checked');
            })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .as('checkboxes')
            .check(); // Marca todos

        cy.get('@checkboxes')
            .each(checkbox => {
                expect(checkbox[0].checked).to.equal(true); // Verifica se estão marcados
            });

        
        cy.get('@checkboxes')
            .last()
            .uncheck()
            .should('not.be.checked'); //Desmarca e checa

        // cy.get('@checkboxes') // de forma condensada
        //     .check()
        //     .should('be.checked')
        //     .last()
        //     .uncheck()
        //     .should('not.be.checked'); 
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .then(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            });
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', {action: "drag-drop"})
            .then(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            });
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture("example.json", {encoding: 'null'}).as('exampleFile');
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@exampleFile')
            .then(input => { // input retornado do selectFile
                expect(input[0].files[0].name).to.equal('example.json')
            });
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank'); // Verifica que o link abre em outra página sem clicar
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a[href="privacy.html"]')
            .invoke('removeAttr', 'target') //Removendo o atributo target para não abrir em outra aba
            .click(); 
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade');
        cy.contains('Talking About Testing').should('be.visible');
    });
})