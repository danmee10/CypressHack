describe('WorkoutForm', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('workoutForm');
  })

  describe('Creating workouts', function() {
    describe('Validations', function() {
      it("Will not submit an invalid workout");
    });


    it("Sets the header correctly", function() {
      cy.get('h1')
        .should('contain', 'Create Workout');
    });

    describe("Adding intervals", function() {
      it("Interval form opens on click", function() {
        cy.get('mat-expansion-panel').click();
        cy.get('.mat-expansion-panel-content')
          .should('be.visible');
      });

      it("Initializes intervalRest with the value from the Workout Rest Input", function() {
        cy.get('input[formcontrolname="name"]').type("Test Workout");
        cy.get('textarea[formcontrolname="description"]').type("This is a test workout for testing workouts");
        cy.get('input[formcontrolname="workoutRest"]').type(60);

        cy.get('input[formcontrolname="intervalRest"]').should('have.value', '60');
      });

      it("Can add multiple exercises to the interval", function() {
        cy.get('app-workout-interval-form > form > button').click();
        cy.get('.mat-tab-label').should('have.length', 2);
      });

      it("Can remove exercises from the interval", function() {
        cy.get('.mat-tab-body-content > button').last().click();
        cy.get('.mat-tab-label').should('have.length', 1);
      });

      describe("Validations", function() {
        it("Will not submit an invalid interval");
      });

      it("Populates Resistance Type and Units correctly based on the exercise", function() {
        cy.get('select[formcontrolname="exercise"]').select('Push up');
        cy.get('select[formcontrolname="resistanceType"]').should('have.value', '1: Weight');
        cy.get('select[formcontrolname="resistanceUnits"]').should('have.value', '1: lbs');

        cy.get('select[formcontrolname="exercise"]').select('Sprint');
        cy.get('select[formcontrolname="resistanceType"]').should('have.value', '2: Distance');
        cy.get('select[formcontrolname="resistanceUnits"]').should('have.value', '6: miles');

        cy.get('select[formcontrolname="exercise"]').select('Plank');
        cy.get('select[formcontrolname="resistanceType"]').should('have.value', '3: Duration');
        cy.get('select[formcontrolname="resistanceUnits"]').should('have.value', '9: seconds');
      });

      it("Adds a valid interval to the workout", function() {
        cy.get('input[formcontrolname="sets"]').type(5);
        cy.get('input[formcontrolname="intervalRest"]').clear().type(30);
        cy.get('select[formcontrolname="exercise"]').select('Push up');
        cy.get('input[formcontrolname="targetReps"]').type(20);

        cy.contains('button', 'Add to workout').click();

        const expectedContentMap = [
          '5',
          'Push up',
          '20',
          '0',
          'lbs',
          '30'
        ]
        cy.get('mat-table.workout-interval-view > mat-row > mat-cell').each((cell, i) => {
          cy.log("i --> ", i);
          cy.log("expectedContentMap[i] --> ", expectedContentMap[i]);
          if (i > 5) { return; }
          cy.wrap(cell).should('contain', expectedContentMap[i])
        });
      });

      it("Adds a valid interval with multiple exercises to the workout", function() {
        cy.get('input[formcontrolname="sets"]').type(3);
        cy.get('select[formcontrolname="exercise"]').select('Squat');
        cy.get('input[formcontrolname="targetReps"]').type(5);
        cy.get('input[formcontrolname="resistanceValue"]').type(500);
        cy.contains('button', 'Add another exercise to build a SuperSet').click();

        cy.get('select[formcontrolname="exercise"]').select('Bench press');
        cy.get('input[formcontrolname="targetReps"]').type(5);
        cy.get('input[formcontrolname="resistanceValue"]').type(300);
        cy.contains('button', 'Add another exercise to build a SuperSet').click();

        cy.get('select[formcontrolname="exercise"]').select('Dead lift');
        cy.get('input[formcontrolname="targetReps"]').type(5);
        cy.get('input[formcontrolname="resistanceValue"]').type(3000);
        cy.contains('button', 'Add another exercise to build a SuperSet').click();

        cy.get('select[formcontrolname="exercise"]').select('Sprint');
        cy.get('input[formcontrolname="targetReps"]').type(5);
        cy.get('input[formcontrolname="resistanceValue"]').type(20);
        cy.get('input[formcontrolname="resistanceUnits"]').type('yards');
        cy.contains('button', 'Add another exercise to build a SuperSet').click();

        // Delete first exercise (Squat)
        cy.get('.mat-tab-label').first().click();
        cy.contains('button', 'Remove exercise from interval').click();

        // No need to assert here.  Will confirm data structure with final WorkoutForm
        // payload inspection on submit.
        cy.contains('button', 'Add to workout').click();
      });
    });

    describe("Editing intervals", function() {

    });

    it("Sends the workout to the server on save", function() {

    });
  });
});