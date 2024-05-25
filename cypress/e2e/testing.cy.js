describe('Ventana Inicial', () => {
  it('La prueba deberá de validar que la ventana cuenta con el título de la aplicación así como los textos correspondientes ', () => {
    cy.visit('http://localhost:8080')
    cy.get('#pregunta').should('have.text', '¿Eres el mejor maestro pokemon del mundo?');
    cy.get('#instruc').should('have.text', 'Memoriza la mayor cantidad de Pokemons y demuestralo!!');
    cy.get('#equipo').should('have.text', 'Equipo elegido para esta ronda:');
    cy.get('#botonJuego').click();
    cy.get('#secuencia').should('have.text', 'Para enviar la secuencia de Pokemons da click en el Pokemon deseado, una vez que termines tu secuencia enviala dando click en la Pokebola');
    cy.get('#solosi').should('have.text', 'Si te equivocas no pasa nada, solo da click en el pokemon que quieras remover y este será eliminado de la secuencia');
  });
  it('La prueba deberá validar que aparezca un conjunto inicial de 6 Pokemons a la vista del usuario' , () => {
    cy.visit('http://localhost:8080')
    cy.get('#botonJuego').click();
    cy.get('.pokemon-image').should('have.length',6);
})
it('La prueba deberá validar que exista el botón de jugar' , () => {
  cy.visit('http://localhost:8080')
  cy.get('#botonJuego').should('be.visible')
})  
})
describe('Sequencia Inicial', () => {
  beforeEach(() => {
        cy.visit('http://localhost:8080');
  });
  it('La  prueba  deberá  interceptar  la  llamada  realizada  por  el  botón  Jugar', () => {
    cy.intercept('POST', 'https://poke-memo-app-9528044356ae.herokuapp.com/enviarSecuencia').as('enviarSecuencia');
    cy.get('#botonJuego').click();
    cy.wait('@enviarSecuencia').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      const secuencia = interception.response.body.pokemonSequence;
      secuencia.forEach((pokemon, index) => {
        cy.get(`[data-cy='secuencia-maquina-${index}']`, { timeout: 10000 }).should('have.attr', 'src', pokemon.imagenUrl);
      });
      });
    })
    it('La  prueba  deberá  interceptar  la  llamada  realizada  por  el  botón  Jugar', () => {
      cy.intercept('POST', 'https://poke-memo-app-9528044356ae.herokuapp.com/enviarSecuencia').as('enviarSecuencia');
      cy.get('#botonJuego').click();
      cy.wait(5000);
      cy.wait('@enviarSecuencia').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
          cy.get("[data-cy^='secuencia-maquina-']").then(($elements) => {
        const totalDittos = $elements.length;
        for (let i = 0; i < totalDittos; i++) {
          cy.get(`[data-cy='secuencia-maquina-${i}']`).should('have.attr', 'src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png');
        }
      });
    })
    it('La  prueba  deberá  validar  que  la  secuencia  sea  reemplazada  después  de  5 segundos  por  el  Pokemon  Ditto', () => {
      cy.intercept('POST', 'https://poke-memo-app-9528044356ae.herokuapp.com/enviarSecuencia').as('enviarSecuencia');
      cy.get('#botonJuego').click();
      cy.wait(5000);
      cy.wait('@enviarSecuencia').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
          cy.get("[data-cy^='secuencia-maquina-']").then(($elements) => {
        const totalDittos = $elements.length;
        for (let i = 0; i < totalDittos; i++) {
          cy.get(`[data-cy='secuencia-maquina-${i}']`).should('have.attr', 'src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png');
        }
      });
    });
})
describe('Creación y envío de secuencia', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('La prueba debe de validar que al dar click en un Pokemon este sea añadido a la secuencia', () => {
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');
    cy.get('#botonJuego').click();
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0);
    cy.wait(10000);
    cy.get('.image-button').first().click();
    cy.get('.ImagenesPokemon').should('have.length', 1);
  });

  it('La prueba debe de validar que al dar click en un Pokemon de la secuencia este sea removido', () => {
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');
    cy.get('#botonJuego').click();
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0);
    cy.wait(5000);
    cy.get('.image-button').first().click();
    cy.get('.ImagenesPokemon').should('have.length', 1);

    cy.get('.secuencia-container .pokemon-image').first().click();
    cy.get('.secuencia-container .pokemon-image').should('have.length', 0);
  });

  it('La prueba debe de validar que la secuencia sea enviada como parámetro en la petición POST que se llama al dar click en el botón “Enviar secuencia”', () => {
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');
    cy.get('#botonJuego').click();
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0);
    cy.wait(10000);

    cy.get('[data-cy^="secuencia-maquina-"]').then($seqMemorizar => {
      const secuenciaAMemorizarLength = $seqMemorizar.length;

      for (let i = 0; i < secuenciaAMemorizarLength; i++) {
        cy.get('.image-button').eq(i).click();
        if (i < secuenciaAMemorizarLength - 1) {
          cy.get('.play-button').should('not.be.visible');
        }
      }

      cy.get('.play-button').should('be.visible').click();
    });
  });

  it('La prueba debe de validar que la secuencia sea enviada como parámetro en la petición POST que se llama al dar click en el botón “Enviar secuencia”', () => {
    cy.intercept('POST', '**/enviarSecuencia').as('enviarSecuencia');
    cy.visit('http://localhost:8080'); 

    cy.get('#botonJuego').click();
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');
    cy.get('.secuencia-container .pokemon-image').should('have.length', 0);
    cy.wait(10000);

    cy.get('.image-button').first().click();
    cy.get('.image-button').first().invoke('attr', 'data-cy').then(dataCy => {
      const index = parseInt(dataCy.split('-')[1]);
      const secuenciaActual = [index + 1];

      cy.get('.play-button').should('be.visible');
      cy.get('.play-button').click();

      cy.wait('@enviarSecuencia').its('request.body').should(body => {
        expect(body).to.have.property('idJuego');
      });
    });
  });
});
describe('Finalización del juego ', () => {
  it('La  prueba  debe  de  validar  que  al  finalizar  el  juego  aparezca  el  número  de pokemons que el jugador memorizó', () => {
    cy.intercept('POST', '**/enviarSecuencia').as('enviarSecuencia');

      cy.visit('http://localhost:8080'); // Asegúrate de que la URL sea la correcta
  
      // Verifica que el botón de iniciar juego esté presente y haz clic en él
      cy.get('#botonJuego').click();
  
      // Espera un momento para permitir que la secuencia inicial se cargue (ajusta el tiempo según sea necesario)
      cy.wait(10000);
  
      // Agrega un solo Pokémon a la secuencia a enviar
      cy.get('.image-button').first().click();
  
      // Verifica que el botón de "Enviar Secuencia" sea visible y haz clic en él
      cy.get('.play-button').should('be.visible').click();
  
      // Espera a que la solicitud POST sea enviada y responde simulando el fin del juego
      cy.wait('@enviarSecuencia').then(({ response }) => {
        // Simula que el juego ha terminado y que el servidor responde con el puntaje
        
        
        cy.get('h1').contains('GAME OVER').should('be.visible');
        cy.get('#puntaje').should('contain.text', 'Puntaje: 0')
        // Verifica que aparezca el puntaje en la pantalla de fin del juego
        //cy.get('#Puntaje').contains(⁠ Puntaje: 1 ⁠).should('be.visible');
      });
      });
    });