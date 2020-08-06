describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Foo Bar',
      username: 'foobar',
      password: 'password123'
    }

    const user2 = {
      name: 'Spam Ham',
      username: 'spamham',
      password: 'password123'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.request('POST', 'http://localhost:3001/api/users', user2)
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
      cy.login({ username: 'foobar', password: 'password123' })
    })

    it('a new blog can be created', function() {
      cy.get('#newBlogButton').click()
      cy.get('#titleInput').type('My Awesome Blog')
      cy.get('#authorInput').type('Foobar McJohnson')
      cy.get('#urlInput').type('https://www.example.net')
      cy.get('#newBlogSubmitButton').click()

      cy.get('.blogList').contains('My Awesome Blog')
    })

    describe('And there are blogs', function() {
      beforeEach(function() {
        const blogs = [
          { title: 'React patterns', author: 'Michael Chan', likes: 7, url: 'https://reactpatterns.com/' },
          { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5, url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html' },
          { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12, url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html' }
        ]

        blogs.map(blog => {
          cy.createBlog(blog)
        })
        cy.visit('http://localhost:3000')
      })

      it('user can like a blog', function() {
        cy.get('div.blogList > div:nth-child(2) .showButton').click()
        cy.get('div.blogList > div:nth-child(2)').should('contain', 'Likes 7')
        cy.get('div.blogList > div:nth-child(2) .likeButton').click()
        cy.get('div.blogList > div:nth-child(2)').should('contain', 'Likes 8')
      })

      it('user can delete their own blog', function() {
        cy.get('.blog').should('have.length', 3)
        cy.get('div.blogList > div:nth-child(2) .showButton').click()
        cy.get('div.blogList > div:nth-child(2) .deleteButton > button').click()
        cy.get('.blog').should('have.length', 2)
      })

      it('user cannot delete someone else\'s blog', function() {
        cy.login({ username: 'spamham', password: 'password123' })
        cy.get('div.blogList > div:nth-child(2) .showButton').click()
        cy.get('div.blogList > div:nth-child(2) .deleteButton').should('have.css', 'display', 'none')
      })

      it('blogs are ordered by number of likes', function() {
        cy.get('.showButton').click({ multiple: true })
        cy.get('.blogLikes').then(($likes) => {
          let lastLikes = Infinity
          const likesRe = /Likes\D+(\d+)\D/

          for (let i = 0; i < $likes.length; i++) {
            const matches = $likes[i].innerText.match(likesRe)
            const blogLikes = parseInt(matches[1])

            cy.expect(blogLikes <= lastLikes).to.be.true
            lastLikes = blogLikes
          }
        })
      })
    })
  })
})