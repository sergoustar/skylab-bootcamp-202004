const searchContacts = require('../logic/search-contacts')
const Feedback = require('./Feedback')

function SearchContacts(callback) {
// colorines i el formateo 
console.log("buscando gente")

    searchContacts(query, (error, contacts) => {
        if (error) {
            Feedback(error.message, "error")

            callback(error)

            return
        }
  
        callback(null)
    })
}

module.exports = SearchContacts