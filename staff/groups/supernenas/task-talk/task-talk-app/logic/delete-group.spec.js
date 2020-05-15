"use strict"

describe("deleteGroup", () => {
    let testUsername = "pepitogrilloskylab"

    beforeEach(() => {
        Trello.setToken(localStorage.trello_token)
    })
    it("should remove a choosen group", (done) => {
        Trello.post("boards/", { name: "removeTestBoard" }, (group) => {
            deleteGroup(group.id, (response) => {
                console.log(response)
                Trello.get("boards/" + group.id, (_group) => {
                    done(group)
                }, (error) => {
                    expect(error.status).to.equal(404)
                    expect(error.statusText).to.equal("error")
                    expect(error.responseText).to.equal("The requested resource was not found.")
                    done()
                })
            }, (error) => {
                done(error)
            })
        }, (error) => {
            done(error)
        })
    })

    it("should throw an error when called with wrong type of parameters", () => {
        expect(function() {
            deleteGroup(123, () => {}, () => {})
        }).to.throw(TypeError, 123 + " is not a string")

        expect(function() {
            deleteGroup("string", undefined, () => {})
        }).to.throw(TypeError, undefined + " is not a function")

        expect(function() {
            deleteGroup("string", () => {}, undefined)
        }).to.throw(TypeError, undefined + " is not a function")
    })

    it("should call onFailure when called with an incorrect id", (done) => {
        deleteGroup("12346578901234567890123456789012", (error) => {
            done(error)
        }, (error) => {
            expect(error.status).to.equal(400)
            expect(error.responseText).to.equal("invalid id")
            expect(error.statusText).to.equal("error")
            done()
        })
    })

    afterEach((done) => {
        function recursive(index, groups) {
            if (index >= 0) {
                Trello.delete("boards/" + groups[index], () => {
                    index--

                    if (index >= 0) {
                        recursive(index, groups)
                    } else {
                        done()
                    }
                }, () => {
                    done()
                })
            } else {
                done()
            }
        }
        Trello.get("members/" + testUsername, (user) => {
            if (user.idBoards.length > 0) {
                recursive(user.idBoards.length - 1, user.idBoards)
            } else {
                done()
            }
        }, () => {
            done()
        })
    })
})