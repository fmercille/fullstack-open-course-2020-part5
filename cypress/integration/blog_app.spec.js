describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Foo Bar',
      username: 'foobar',
      password: 'password123'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Login')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('foobar')
      cy.get('#password').type('password123')
      cy.get('#loginButton').click()

      cy.contains('Foo Bar is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('foobar')
      cy.get('#password').type('wrong')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Foo Bar')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'foobar', password: 'password123'
      }).then(response => {
        localStorage.setItem('user', JSON.stringify(response.body))
      })

      cy.visit('http://localhost:3000')
    })

    it('a new blog can be created', function() {
      cy.get('#newBlogButton').click()
      cy.get('#titleInput').type('My Awesome Blog')
      cy.get('#authorInput').type('Foobar McJohnson')
      cy.get('#urlInput').type('https://www.example.net')
      cy.get('#newBlogSubmitButton').click()

      cy.get('.blogList').contains('My Awesome Blog')
    })
  })
})