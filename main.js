let contract;

    $(document).ready(function() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

            // contract address
            const address = '0x88D4C03e0380E571AAFdE4bc0A076922972d78B3'
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
                    "inputs": [],
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

            // intialization
            web3.eth.getAccounts().then(function(accounts) {
                const acc = accounts[0];
                contract.methods.beforeDeadLine(acc).call().then(function(result) {
                    if(!result)
                        $('#deadline-reached').html("False");
                    else
                        $('#deadline-reached').html("True");
                });

                contract.methods.totalFundRaised(acc).call().then(function(result) {
                    $('#total-funcding').html(result);
                });
                
                contract.methods.getState().call().then(function(result) {
                    const states = ["Ongoing", "Failed", "Succeeded", "PaidOut"]
                    $('#state').html(states[result]);
                });
            });

            // ops
            $('#create-new').click(function() {
                const name = $('#name').val();
                const targetAmt = parseInt($('#target-amt').val());
                const duration = parseInt($('#duration').val());
                console.log(name, targetAmt, duration);

                if(name && targetAmt>0 && duration>0) {
                    web3.eth.getAccounts().then(function(accounts) {
                        const acc = accounts[0];

                        contract.methods.newCF(name, targetAmt, duration).call().then(function(result) {
                            console.log(result);
                        });

                    });
                }
            });
    });