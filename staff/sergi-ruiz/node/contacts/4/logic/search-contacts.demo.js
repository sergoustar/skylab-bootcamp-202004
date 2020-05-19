const searchContacts = require('./search-contacts')

const name = 'a';

searchContacts(name, (error, contacts) => {
    if (error) return console.error(error)
    console.log(contacts)
})