const fs = require('fs')
const path = require('path')

module.exports = callback => {
    fs.readdir(path.join(_dirname, '...', 'data'), (error, files) => {
        if (error) return callback(error)

        let wasError = false

        const contacts = []

        files.forEach(file => {
            fs.readFile(path.join(__dirname, '..', 'data'), file, 'utf8', (error, json) => {
                if (error) {
                    if (!wasError) callback(error)
                    wasError = true

                    return
                }

                const contact = JSON.parse(json)

                contacts.push(contact)

                if (contacts.length === files.length) callback(null, contacts)
            })
        })
    })
}