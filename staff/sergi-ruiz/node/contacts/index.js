const fs = require("fs") //crear conjunto de utils

const readline = require('readline')

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})




prompt.question('What is your name?', name => {
    prompt.question('What is your surname?', surname => {
        prompt.question('What is your phone?', phone => {
            prompt.question('What is your e-mail?', email => {
                prompt.question('What is your web?', web => {
                    prompt.question('What is your instagram?', instagram => {
                        prompt.question('What is your facebook?', facebook => {
                            prompt.question('What is your twitter?', twitter => {
                                prompt.question('What is your fwitter?', fwitter => {
                                    prompt.question('What is your tiktok?', tiktok => {


                                        fs.writeFile(`${file}.json`, `{
                                            "name": "${name}",
                                            "surname": "${surname}",
                                            "phone": "${phone}",
                                            "e-mail": "${email}",
                                            "web": "${web}",
                                            "instagram": "${instagram}",
                                            "facebook": "${facebook}",
                                            "twitter": "${twitter}",
                                            "fwitter": "${fwitter}",
                                            "tiktok": "${tiktok}"
                                        }`, error => {
                                            if (error) throw error
                                        })
                                        number++
                                        prompt.close()
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})