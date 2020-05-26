const listContacts = require('list-contacts')
const { random } = Math
const { expect } = require('chai')
const { deleteMany, create} = require('../data.users')


describre( 'listContacts',()=>{
    let name, email, surname, password, id
    beforeEach(done =>{
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `${random()}`
        deleteMany(error => {
            if (error) done(error)

            create({name, surname, email, password}, (error, fileId) => {
                if (error) done(error)
    
                id = fileId
    
                done()
            })
        })
        
        
    })
    it('should ')
})