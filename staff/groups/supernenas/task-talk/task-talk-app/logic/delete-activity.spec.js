"use strict"

describe('deleteActivity', () => {
    let testUsername = 'pepitogrilloskylab'
    beforeEach(() => {
        expect(localStorage.trello_token).to.not.be.undefined
        Trello.setToken(localStorage.trello_token)
    })
    
    it('should delete a card', (done) => {
        Trello.post('boards/', { name: 'deleteActivityTest' }, (board) => { 
            Trello.get(`boards/${board.id}/lists`, (lists) => {
                Trello.post('cards', { name: 'holaDelete', idList: lists[1].id} , (card)=> {
                    deleteActivity(card.id, () => { 
                        Trello.get(`lists/${lists[1].id}/cards`, (cards) => {
                            expect(cards.length).to.equal(0)
                            done()

                        }, (error) => {
                            expect(error).to.be.undefined
                            
                            done() 
                        })
                    }, (error) => {
                        expect(error).to.be.undefined
                        
                        done()
                    })
                }, (error) => {
                    expect(error).to.be.undefined

                    done()
                }) 
            }, (error) => {
                    expect(error).to.be.undefined

                done()
            })
        }, (error) => { 
            expect(error).to.be.undefined

            done()  
        })        
    })

    it("should call onFailure when given a wrong cardId",(done)=>{
        deleteActivity("12345678901234567890123456789012",()=>{
            expect(true).to.equal(false)
            done();
        },(error)=>{
            expect(error.responseText).to.equal("invalid id")
            expect(error.statusText).to.equal("error")
            expect(error.status).to.equal(400)
            done();
        })
    })

    it("should throw an error if called with the wrong type of parameters",()=>{
        expect(function(){
            deleteActivity((123),()=>{},()=>{})
        }).to.throw(TypeError, 123 +" is not a string")
        
        expect(function(){
            deleteActivity("123123123",undefined,()=>{})
        }).to.throw(TypeError, undefined +" is not a function")
        
        expect(function(){
            deleteActivity("123123123","notafunction",()=>{})
        }).to.throw(TypeError, "notafunction" +" is not a function")
       
        expect(function(){
            deleteActivity("123123123",()=>{},undefined)
        }).to.throw(TypeError, undefined +" is not a function")
        
        expect(function(){
            deleteActivity("123123123",()=>{},"notafunction")
        }).to.throw(TypeError, "notafunction" +" is not a function")
    })
    
    afterEach((done) => {
        function recursive(index,groups){
            if(index >= 0) {
                Trello.delete("boards/"+groups[index],()=>{
                    index--
                    
                    if(index >= 0){
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
        
        Trello.get("members/"+testUsername,(user) => {
            if(user.idBoards.length > 0){
                recursive(user.idBoards.length-1,user.idBoards)
            }else{
                done()
            }
        },()=>{
            done()
        })
    })
})