
const registerUser = require('./register-user')
const { random } = Math
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')


describe.only('logic register-user', () => {   
    
        beforeEach (done => {
        const username = `surname-${random()}`
        const email = `e-${random()}@mail.com`
        const password = random()
        done()
        })

        it('should register an user in data', done => { 
        
          registerUser({username, email, password}, (error, id) => {

            fs.readFile(path.join(__dirname, '..', 'data', 'users', `${id}.json`), 'utf8', (error, content) => {
                expect(error).to.be(null)
                expect(content).to.exist
    
                const contact = JSON.parse(content)
    
                expect.equal(contact.user, user)
                expect.equal(contact.email, email)

                done()
          })
          })
    })
    })
