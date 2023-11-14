
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (valoresObrigatorios) => {
    cy.get('#firstName').type(valoresObrigatorios.nome);
    cy.get('#lastName').type(valoresObrigatorios.sobrenome);
    cy.get('#email').type(valoresObrigatorios.email);
    cy.get('#open-text-area').type(valoresObrigatorios.mensagem); 
    cy.contains('.button', 'Enviar').click();
});