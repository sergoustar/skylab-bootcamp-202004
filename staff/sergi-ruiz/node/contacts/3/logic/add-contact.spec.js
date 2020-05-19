const assert = require('assert')
const addContact = require('./add-contact')
const { random } = Math
const fs = require('fs')

{
    const name = `name-${random()}`
    const surname = `surname-${random()}`
    const email = `e-${random()}@mail.com`

    addContact({ name, surname, email }, (error, id) => {
        assert(error === null)

        assert(typeof id === 'string')

        if (fs.existsSync('../data/${id}')) {
            console.log('hey');
        }



        // TODO read file and check that it contains the name, surname and email

    })
}