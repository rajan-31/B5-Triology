let contract;

    $(document).ready(function() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

            // contract address
            const address = '0xD35fbBf13f3bE1DFCB4145D6CFDf8B9A7865DBD1'
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
                            "internalType": "address",
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
                            "internalType": "address",
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
                            "internalType": "string",
                            "name": "contractName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "targetAmountEth",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
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
                            "internalType": "address",
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
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "allCF",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "targetAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "fundingDeadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "beneficiary",
                            "type": "address"
                        },
                        {
                            "internalType": "enum CrowdFunding.State",
                            "name": "state",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bool",
                            "name": "collected",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
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
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "allOldCF",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "targetAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "fundingDeadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "beneficiary",
                            "type": "address"
                        },
                        {
                            "internalType": "enum CrowdFunding.State",
                            "name": "state",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bool",
                            "name": "collected",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
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
                            "internalType": "address",
                            "name": "add",
                            "type": "address"
                        }
                    ],
                    "name": "beforeDeadLine",
                    "outputs": [
                        {
                            "internalType": "bool",
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
                    "inputs": [],
                    "name": "getState",
                    "outputs": [
                        {
                            "internalType": "enum CrowdFunding.State",
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
                            "internalType": "address",
                            "name": "add",
                            "type": "address"
                        }
                    ],
                    "name": "getTargetAmount",
                    "outputs": [
                        {
                            "internalType": "uint256",
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
                            "internalType": "address",
                            "name": "add",
                            "type": "address"
                        }
                    ],
                    "name": "totalFundRaised",
                    "outputs": [
                        {
                            "internalType": "uint256",
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

            $('#connectMetamask').click(function() {
				if(!ethereum.isMetaMask) {
					ethereum.request({ method: 'eth_requestAccounts' });
				} else {
					alert('Metamask Already connected...');
				}
				$(this).prop('disabled', true);
			});

            // intialization
            web3.eth.getAccounts().then(function(accounts) {
                const acc = accounts[0];

                contract.methods.getTargetAmount(acc).call().then(function(result) {
                    if(result > 0) {
                        $('#have-campaign').html("Yes");
                        $('#show-target-amount').html(result)
                        contract.methods.getState().call().then(function(result) {
                            const states = ["Ongoing", "Failed", "Succeeded", "PaidOut"]
                            $('#state').html(states[result]);
                        });

                        contract.methods.totalFundRaised(acc).call().then(function(result) {
                            $('#total-funcding').html(result);
                        });

                        contract.methods.beforeDeadLine(acc).call().then(function(result) {
                            if(result)
                                $('#deadline-reached').html("False");
                            else
                                $('#deadline-reached').html("True");
                        });
                    }
                    else
                        $('#have-campaign').html("NO");
                });
            });

            // add campaign
            $('#create-new').click(function() {
                const name = $('#name').val();
                const targetAmt = parseInt($('#target-amt').val());
                const duration = parseInt($('#duration').val());

                if(name && targetAmt>0 && duration>0) {
                    web3.eth.getAccounts().then(function(accounts) {
                        const acc = accounts[0];
                    
                        contract.methods.newCF(name, targetAmt, duration)
                        .send({from: acc})
                        .then(function(result) {
                            console.log(result);
                        });

                    });

                }
            });

            // donate
            $('#contribute').click(function() {
                const toAddress = $('#contribute-address').val();
                const amount = $('#contribute-amount').val();

                if(toAddress && amount>0 ) {
                    web3.eth.getAccounts().then(function(accounts) {
                        const acc = accounts[0];
                    
                        contract.methods.contribute(toAddress)
                        .send({from: acc, value: web3.utils.toWei(amount, 'ether')})
                        .then(function(result) {
                            console.log(result);
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
                        console.log(result);
                    });
                });
            });

            // collect funding
            $('#collect').click(function() {
                web3.eth.getAccounts().then(function(accounts) {
                    const acc = accounts[0];

                    contract.methods.collect().send({from: acc})
                    .then(function(result) {
                        console.log(result);
                    });
                });
            });
            
            // withdraw
            $('#withdraw').click(function() {
                const address = $('#withdraw-address').val();

                web3.eth.getAccounts().then(function(accounts) {
                    const acc = accounts[0];

                    contract.methods.withdraw(address).send({from: acc})
                    .then(function(result) {
                        console.log(result);
                    });
                });
            });
    });