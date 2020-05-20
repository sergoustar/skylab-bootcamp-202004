const http = require('http')
const listContacts = require('./logic/list-contacts')
<<<<<<< HEAD
const searchContacts = require('/logic/search-conctacts')
const http = require('http')
const url = require('url')

const server = net.createServer(socket => {
    socket.on('data', data => {
        searchContacts(query, (error, contacts) => {
=======
const searchContacts = require('./logic/search-contacts')
const ListContacts = require('./components/ListContacts')
const SearchContacts = require('./components/SearchContacts')

const server = http.createServer((req, res) => {
    const { url } = req

    res.setHeader('content-type', 'text/html')

    if (url === '/contacts') {
        listContacts((error, contacts) => {
>>>>>>> develop
            if (error) throw error

            res.end(ListContacts(contacts))
        })
    } else if (url.startsWith('/search')) {
        if (!url.includes('?')) {
            res.end(SearchContacts())
        } else {
            const [, queryString] = url.split('?')

            const [, query] = queryString.split('=')

            searchContacts(query, (error, contacts) => {
                if (error) throw error
              
                res.end(`${SearchContacts(query)}${ListContacts(contacts)}`)
            })
        }
    } else if (url === '/add-contact') {

    } else {

    }
})

server.listen(8080)

/* const server = net.createServer(socket => {
    socket.on('data', data => {
        listContacts((error, contacts) => {
            if (error) throw error

            socket.write(`HTTP/1.1 200
content-type: text/html

<h2>Contacts list</h2>
<ul>
    ${contacts.map(({ name }) => `<li>${name}</li>`).join('')}
</ul>
`)
            socket.end()
        })
    })

    socket.on('error', console.log)
})

server.listen(8080)
 */