"use strict"

describe("createNewGroup", () => {
    let testUsername = "pepitogrilloskylab"

    beforeEach((done) => { 
        let authoritationProblem = false

        window.Trello.authorize({
            type: 'popup',
            name: 'Task Talk',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: () => { 
                expect(authoritationProblem).to.equal(false)
                done() 
            },
            error: () => { 
                authoritationProblem = true
                expect(authoritationProblem).to.equal(false)
                done() 
            }
        })
    })

    it("should create a new group without lists or cards and with only one user", (done) => {
        let testError
        
        Trello.get("members/" + testUsername, (user) => {
            expect(user.idBoards.length).to.equal(0)
            
            createNewGroup("createNewGroupTest", (group) => {
                expect(group.name).to.equal("createNewGroupTest")

                Trello.get("boards/" + group.id + "/cards", (cards) => {
                    expect(cards.length).to.equal(0)

                    Trello.get("boards/" + group.id + "/members", (members) => {
                        expect(members.length).to.equal(1)

                        expect(members[0].id).to.equal(user.id)
                        
                        done()
                    }, (error) => {
                        testError = error
                        expect(testError).to.be.undefined
                        done()
                    })
                }, (error) => {
                    testError = error
                    expect(testError).to.be.undefined
                    done()
                })
            }, (error) => {
                testError = error
                expect(testError).to.be.undefined
                done()
            })
        }, (error) => {
            testError = error
            expect(testError).to.be.undefined
            done()
        })
    })

    it("should throw an error if called with the wrong type of parameters", () => {
        expect(function() {
            createNewGroup((123), () => {}, () => {})
        }).to.throw(TypeError, 123 + " is not a string")
        
        expect(function() {
            createNewGroup(undefined, () => {}, () => {})
        }).to.throw(TypeError, undefined + " is not a string")
        
        expect(function() {
            createNewGroup("(123)", undefined, () => {})
        }).to.throw(TypeError, undefined + " is not a function")
        
        expect(function() {
            createNewGroup("(123)", () => {})
        }).to.throw(TypeError, undefined + " is not a function")
        
        expect(function() {
            createNewGroup("(123)", "notafunction", () => {})
        }).to.throw(TypeError, "notafunction is not a function")
        
        expect(function() {
            createNewGroup("(123)", () => {}, "notafunction")
        }).to.throw(TypeError, "notafunction is not a function")
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