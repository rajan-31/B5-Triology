let contract;

    $(document).ready(function() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

            // contract address
            const address = '0x9D4d04612B078A676CAa740a33bd7f93D69642B3'
            const abi = [
				{
					"constant": false,
					"inputs": [],
					"name": "collect",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "contribute",
					"outputs": [],
					"payable": true,
					"stateMutability": "payable",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "finishedCrowdFunding",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "contractName",
							"type": "string"
						},
						{
							"name": "targetAmountEth",
							"type": "uint256"
						},
						{
							"name": "durationInMin",
							"type": "uint256"
						}
					],
					"name": "newCF",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "withdraw",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "",
							"type": "address"
						}
					],
					"name": "allCF",
					"outputs": [
						{
							"name": "name",
							"type": "string"
						},
						{
							"name": "targetAmount",
							"type": "uint256"
						},
						{
							"name": "fundingDeadline",
							"type": "uint256"
						},
						{
							"name": "beneficiary",
							"type": "address"
						},
						{
							"name": "state",
							"type": "uint8"
						},
						{
							"name": "collected",
							"type": "bool"
						},
						{
							"name": "totalCollected",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "",
							"type": "address"
						},
						{
							"name": "",
							"type": "uint256"
						}
					],
					"name": "allOldCF",
					"outputs": [
						{
							"name": "name",
							"type": "string"
						},
						{
							"name": "targetAmount",
							"type": "uint256"
						},
						{
							"name": "fundingDeadline",
							"type": "uint256"
						},
						{
							"name": "beneficiary",
							"type": "address"
						},
						{
							"name": "state",
							"type": "uint8"
						},
						{
							"name": "collected",
							"type": "bool"
						},
						{
							"name": "totalCollected",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "beforeDeadLine",
					"outputs": [
						{
							"name": "",
							"type": "bool"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "getState",
					"outputs": [
						{
							"name": "",
							"type": "uint8"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "getTargetAmount",
					"outputs": [
						{
							"name": "",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "add",
							"type": "address"
						}
					],
					"name": "totalFundRaised",
					"outputs": [
						{
							"name": "",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}
			]

            contract = new web3.eth.Contract(abi, address);

            // check metamask connection
            if(!ethereum.isMetaMask) {
                ethereum.request({ method: 'eth_requestAccounts' });
            } else {
				$('#connectMetamask').html("Metamask Is Connected")
                $('#connectMetamask').prop('disabled', true);
            }

            // connect metamask
            $('#connectMetamask').click(function() {
				if(!ethereum.isMetaMask) {
					ethereum.request({ method: 'eth_requestAccounts' });
				} else {
					alert('Metamask Already connected...');
					$(this).prop('disabled', true);
				}
			});

			// reload window on account change
			window.ethereum.on('accountsChanged', function (accounts) {
				window.location.reload();
			  })

            // intialization
            web3.eth.getAccounts().then(function(accounts) {
                const acc = accounts[0];

                contract.methods.getTargetAmount(acc).call().then(function(result) {
                    if(result > 0) {
						$('#my-campaign-creation').attr('hidden', "true")
                        $('#campaign-address').html(acc);
						
                        $('#show-target-amount').html( parseFloat( web3.utils.fromWei(result, 'milli')/1000 ).toFixed(3) );
                        contract.methods.getState(acc).call().then(function(result) {
                            const states = ["Ongoing", "Failed", "Succeeded", "PaidOut"]
                            $('#state').html(states[result]);
                        });

                        contract.methods.totalFundRaised(acc).call().then(function(result) {
                            $('#total-funding').html(parseFloat( web3.utils.fromWei(result, 'milli')/1000 ).toFixed(3));
                        });

                        contract.methods.beforeDeadLine(acc).call().then(function(result) {
                            if(result)
                                $('#deadline-reached').html("False");
                            else
                                $('#deadline-reached').html("True");
                        });
                    }
                    else{
                        // $('#have-campaign').html("NO");
						$('#my-campaign-data').attr('hidden', "true");
					}
                });
            });

            // add campaign
            $('#create-new').click(function() {
                const name = $('#name').val();
                const targetAmt = $('#target-amt').val() //web3.utils.toWei($('#target-amt').val(), 'ether');
                const duration = parseInt($('#duration').val());

                if(name && targetAmt>0 && duration>0) {
                    web3.eth.getAccounts().then(function(accounts) {
                        const acc = accounts[0];
                    
                        contract.methods.newCF(name, targetAmt, duration)
                        .send({from: acc})
                        .then(function(result) {
                            alert("Campaign Creted Successfully, please refresh the page.");
							window.location.reload();
                        }).catch(function(err) {
							console.log(err)
						});

                    });

                }
            });

            // donate
            $('#contribute').click(function() { 
                const toAddress = $('#contribute-address').val();
                const _amount = parseInt($('#contribute-amount').val());
				const amount = _amount.toString()
				// console.log(typeof(amount));
				// console.log(web3.utils.toWei(amount, 'milli'))
                if(toAddress && amount>0 ) {
                    web3.eth.getAccounts().then(function(accounts) {
                        const acc = accounts[0];
                    
                        contract.methods.contribute(toAddress)
                        .send({from: acc, value: web3.utils.toWei(amount, 'milli') })
                        .then(function(result) {
							alert("You have successfully contributed "+ amount + " milli ETH")
							window.location.reload();
                        }).catch(function(err) {
							console.log(err);
						});

                    });

                }
            });

            // finish funding
            $('#finish-my-crowd-funding').click(function() {
                web3.eth.getAccounts().then(function(accounts) {
                    const acc = accounts[0];

                    contract.methods.finishedCrowdFunding(acc).send({from: acc})
                    .then(function(result) {
                        alert("Your campaign is finished now.")
						window.location.reload();
                    }).catch(function(err) {
						console.log(err);
					});
                });
            });

            // collect funding
            $('#collect').click(function() {
                web3.eth.getAccounts().then(function(accounts) {
                    const acc = accounts[0];

                    contract.methods.collect().send({from: acc})
                    .then(function(result) {
                        alert("Your collected amount to your account.");
						window.location.reload();
                    }).catch(function(err) {
						console.log(err);
					});
                });
            });
            
            // withdraw
            $('#withdraw').click(function() {
                const address = $('#withdraw-address').val();
				if(address) {
					web3.eth.getAccounts().then(function(accounts) {
						const acc = accounts[0];

						contract.methods.withdraw(address).send({from: acc})
						.then(function(result) {
							alert("Your ethers are refunded successfully!")
							window.location.reload();
						}).catch(function(err) {
							console.log(err)
						});
					});
				}
            });

    });