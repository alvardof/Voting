const Voting = artifacts.require('Voting');
const expect = require('chai').expect;
const time = require('./utils/time');

contract('Voting', account => {
    [account_1, account_2, account_3, account_4, account_5, account_6, account_7 , account_8 , account_9] = account;
    let VotingInstance;

    beforeEach(async () => {
        VotingInstance = await Voting.new({from: account_1});
    });

    context('contructor', async () => {

        it('nominacion en cero', async () => {

            const nominations = await VotingInstance.number_candidates();
            expect(nominations.toNumber()).to.equal(0);
        
        });

    });


    context('registro usuario', async () => {

        it('que el usuario no este previamente registrado', async () => {
            try {
                
                await VotingInstance.registerUser({from: account_1});
                await VotingInstance.registerUser({from: account_1});
                
            } catch (error) {

                expect(error.reason).to.equal('Previously registered user');
                
            }
           
        });

        

    });



    context('postular candidatos', async () => {

        it('solo el dueño puede postular', async () => {

            
            try {

                await VotingInstance.nominationCantidate(account_4 , {from: account_2});

            } catch (error) {

                expect(error.reason).to.equal('Caller is not owner');
                
            }

        
        });



        it('el candidato no esta previamente registrado como usuario', async () => {

            
            try {

                await VotingInstance.nominationCantidate(account_4 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Candidate not previously registered as a voter/user');
                
            }

        
        });


        it('el candidato ya esta postulado', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_4});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Candidate already nominated');
                
            }

        
        });



        it('cupo de 5 maximo', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_3});
                await VotingInstance.registerUser({from: account_4});
                await VotingInstance.registerUser({from: account_5});
                await VotingInstance.registerUser({from: account_6});
                await VotingInstance.registerUser({from: account_7});
                await VotingInstance.nominationCantidate(account_2 , {from: account_1});
                await VotingInstance.nominationCantidate(account_3 , {from: account_1});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});
                await VotingInstance.nominationCantidate(account_5 , {from: account_1});
                await VotingInstance.nominationCantidate(account_6 , {from: account_1});
                await VotingInstance.nominationCantidate(account_7 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Finished the 5 available nominations');
                
            }

        
        });

        




    });


    context('funcion votar', async () => {

        it('ya voto', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_3});
                await VotingInstance.nominationCantidate(account_3 , {from: account_1});

                await VotingInstance.vote(account_3 , {from: account_2});
                await VotingInstance.vote(account_3 , {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('User previously voted');
                
            }

        
        });


        /*it('el votante no esta previamente registrado', async () => {


            try {

                await VotingInstance.registerUser({from: account_8});
                await VotingInstance.nominationCantidate(account_8, {from: account_1});

                await VotingInstance.vote(account_8, {from: account_9});


            } catch (error) {

                expect(error.reason).to.equal('voter not previously registered');
                
            }
        
            
        
        });*/

         it('csndidato no registrado previamente', async () => {


            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_8});
                //await VotingInstance.nominationCantidate(account_8, {from: account_1});

                await VotingInstance.vote(account_8, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('Candidate not previously registered');
                
            }
        
            
        
        });


        it('no se puede votar por si mismo', async () => {


            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.nominationCantidate(account_2, {from: account_1});

                await VotingInstance.vote(account_2, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('cannot self-vote');
                
            }
        
            
        
        });


        it('plazo de una semana para votar', async () => {


            try {

                //await time.increase();
                //await VotingInstance.registerUser({from: account_5});
                //await VotingInstance.registerUser({from: account_2});
                //await VotingInstance.nominationCantidate(account_5, {from: account_1});

                await VotingInstance.vote(account_3, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('one week to vote has expired');
                
            }
        
            
        
        });


    });




});