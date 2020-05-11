describe("retrieveUserGroups",()=>{
    let testUsername="pepitogrilloskylab"
    beforeEach((done)=>{ //Compruebo que hay autorización
        let authoritationProblem=false;
        window.Trello.authorize({
            type: 'popup',
            name: 'Task Talk',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: '1hour',
            success: ()=>{expect(authoritationProblem).to.equal(false); done()},
            error: ()=>{authoritationProblem=true; expect(authoritationProblem).to.equal(false);done()}
        });
    })
    it("should return the groups the user forms part of",(done)=>{
        //Primero creo un tablon de trello para el usuario
        let testError
        Trello.post("boards/",{name: "retrieveTest"},()=>{
            //Compruebo que el usuario está asociado a un tablon y tienen los mismos datos
            retrieveUserGroups(testUsername,(results)=>{
                expect(results.length).to.equal(1);
                expect(results[0].name).to.equal("retrieveTest");
                //Creo otro tablon y compruebo que el usuario está asociado a dos tablones
                Trello.post("boards/",{name:"retrieveTest2"},()=>{
                    retrieveUserGroups(testUsername,(results)=>{
                        expect(results.length).to.equal(2);
                        expect(results[0].name).to.equal("retrieveTest");
                        expect(results[1].name).to.equal("retrieveTest2");
                        done();
                    },(error)=>{
                        testError=error;
                        expect(testError).to.be.undefined;
                        done();
                    })
                },(error)=>{
                    testError=error;
                    expect(testError).to.be.undefined;
                    done();
                })
            },(error)=>{
                testError=error;
                expect(testError).to.be.undefined;
                done();
            })
        },(error)=>{
            testError=error.status;
            expect(testError).to.be.undefined;//Esto saltará error siempre y así sabemos en el mocha donde ha fallado
            done();
        })
    })
    it("should throw an error when called with incorrect parameters",()=>{
        expect(function(){
            retrieveUserGroups((123),()=>{},()=>{})
        }).to.throw(TypeError, 123 +" is not a string")
        expect(function(){
            retrieveUserGroups(undefined,()=>{},()=>{})
        }).to.throw(TypeError, undefined +" is not a string")
        expect(function(){
            retrieveUserGroups("user")
        }).to.throw(TypeError, undefined +" is not a function")
        expect(function(){
            retrieveUserGroups("user","notafunction")
        }).to.throw(TypeError, "notafunction" +" is not a function")
        expect(function(){
            retrieveUserGroups("user",()=>{})
        }).to.throw(TypeError, undefined +" is not a function")
        expect(function(){
            retrieveUserGroups("user",()=>{},"notafunction")
        }).to.throw(TypeError, "notafunction" +" is not a function")
    })
    afterEach((done)=>{ //Borro los tablones que he creado para las pruebas
        function recursive(index,groups){
            if(index>=0){
                Trello.delete("boards/"+groups[index],()=>{
                    index--;
                    if(index>=0){
                        recursive(index,groups)
                    }else{
                        done();
                    }
                },()=>{
                    done();
                })
            }else{
                done();
            }
        }
        Trello.get("members/"+testUsername,(user)=>{
            if(user.idBoards.length>0){
                recursive(user.idBoards.length-1,user.idBoards);
            }else{
                done();
            }
        },()=>{
            done();
        })
    })
})