"use strict"

describe("inviteToGroup",()=>{
    let testUsername="pepitogrilloskylab"

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
            success: ()=>{expect(authoritationProblem).to.equal(false); done()},
            error: ()=>{authoritationProblem=true; expect(authoritationProblem).to.equal(false);done()}
        })
    })

    it("should invite a user to the group", done => {
        Trello.post("boards/",{name: "inviteTest"}, (group) => {
            Trello.get(`boards/${group.id}/members`, (members) => {
                expect(members.length).to.equal(1)

                inviteToGroup("5bc71f9b224462720874c409", group.id, (newmembers) => {
                    expect(newmembers.id).to.equal(group.id)
                    expect(newmembers.members.length).to.equal(2)
                    expect(newmembers.members[0].username).to.equal("graciahector")
                    expect(newmembers.members[1].username).to.equal("pepitogrilloskylab")
                    done()
                }, () => {
                    expect(true).to.equal(false)
                    done()
                })
            }, () => {
                expect(true).to.equal(false)
                done()
            })
        },() => { 
            expect(true).to.equal(false)
            done()
        })
    }) 

    it("should trow an error when called with the wrong type of parameters",() => {
        expect(function() {
            inviteToGroup((123), "listID", () => {}, () => {})
        }).to.throw(TypeError, 123 +" is not a string")

        expect(function(){
            inviteToGroup(undefined, "listID", () => {}, () => {})
        }).to.throw(TypeError, undefined + " is not a string")
       
        expect(function(){
            inviteToGroup("123",123,() => {}, () => {}) 
        }).to.throw(TypeError, 123 +" is not a string")
        
        expect(function(){
            inviteToGroup("123",undefined, () => {}, () => {})
        }).to.throw(TypeError, undefined +" is not a string")
        
        expect(function(){ 
            inviteToGroup("123123","123123", undefined, () => {})
        }).to.throw(TypeError, undefined +" is not a function")
        
        expect(function(){
            inviteToGroup("123123","123123", "notafunction", () => {})
        }).to.throw(TypeError, "notafunction is not a function")
        
        expect(function(){
            inviteToGroup("123123","123123", () => {}, undefined)
        }).to.throw(TypeError, undefined +" is not a function")
        
        expect(function(){
            inviteToGroup("123123","123123",() => {}, "notafunction")
        }).to.throw(TypeError, "notafunction is not a function")
    })

    it("should call onFailure when given a wrong userid", (done) => {
        inviteToGroup("123456789012345678901234567890", "123456789012345678901234567890", () => {
            expect(true).to.equal(false)
            done()
        }, (error) => {
            expect(error.responseText).to.equal("invalid id")
            expect(error.status).to.equal(400)
            expect(error.statusText).to.equal("error")
            done()
        })
    })
    it("should call onFailure when given a wrong groupid",(done)=>{
        inviteToGroup("5bc71f9b224462720874c409", "123456789012345678901234567890", () => {
            expect(true).to.equal(false)
            done()
        },(error) => {
            expect(error.responseText).to.equal("invalid id")
            expect(error.status).to.equal(400)
            expect(error.statusText).to.equal("error")
            done()
        })
    })
    afterEach((done) => { 
        function recursive(index,groups){
            if(index >= 0){
                Trello.delete("boards/"+groups[index],()=>{
                    index--
                    if(index>=0){
                        recursive(index,groups)
                    }else{
                        done()
                    }
                },()=>{
                    done()
                })
            }else{
                done()
            }
        }
        Trello.get("members/" + testUsername, (user) => {
            if(user.idBoards.length > 0){
                recursive(user.idBoards.length-1, user.idBoards)
            } else {
                done()
            }
        },() => {
            done()
        })
    })
})