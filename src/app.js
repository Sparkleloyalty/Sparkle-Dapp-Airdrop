/**
 * @title SparkleAirdropClaimTokensApp
 * @author mrbitkoin - Sparklemobile (c) 2018
 * @description Web3 backend support tailored to the Sparkle Token Airdrop smart contract
 */
SparkleAirDropClaimTokensApp = {
	// Initialize the variables that will be used in a "global" scope
	web3Provider: null,
	// Initialize the Sparkle token airdrop contract ABI
	abi: [{"constant":false,"inputs":[],"name":"resume","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTotalTokensRemaining","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerField","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addressToLookUp","type":"address"}],"name":"isAddressInAirdropList","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTokensClaimed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressesToRemove","type":"address[]"}],"name":"bulkRemoveAddressesFromAirDrop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressesToAdd","type":"address[]"},{"name":"_tokenAward","type":"uint256"}],"name":"bulkAddAddressesToAirDropWithAward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addressesToAdd","type":"address[]"}],"name":"bulkAddAddressesToAirDrop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressToChange","type":"address"},{"name":"_newWasClaimedValue","type":"bool"}],"name":"setAirdropAddressWasClaimed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}],
	// Initialize the Sparkle token contract instance
	contractAddress: '0x33D9Eb04442b7711cec632384DF6BbA45B141d3A',

	/**
	 * @title init
	 * @description Grab the available injected/rpcjson endpoint
	 */
	init: async function() {
		// Log activity to console
		console.log("init: Done!");
		// Return the web3 object associated with this browser window
		return await SparkleAirDropClaimTokensApp.initWeb3();
	},

	/**
	 * @title initWeb3
	 * @desciption Initialize the available Web3 provider for use
	 */
	initWeb3: async function() {
		// Determine if an injected web3 provider (modern dapp browser) exists
		if(window.ethereum) {
			// Yes, so assign this injected provider internally
			SparkleAirDropClaimTokensApp.web3Provider = window.ethereum;
			// Attempt to link this Dapp with the users provider (Mist/Metamask)
			try {
				// Syncronous wrapper for a asyncronous call
				await window.ethereum.enable();
				// Log activity to console
				console.log("initWeb3[success]: Found an injected Web3 provider.");
			}
			// There was an error of some kind encountered
			catch(error) {
				// Log activity to conosole
				console.error("initWeb3[err]: Provider has denied access.");
				// Return preventing any further processing
				return;
			}

		}
		// Determine if there is a legacy injected web3 provider
		else if(window.web3) {
			// Yes, assign the found provider internally
			SparkleAirDropClaimTokensApp.web3Provider = window.web3.currentProvider;
		}
		// Fallback to localhost provider if no injected provider was found
		else {
			// Assign the found provided internally
			SparkleAirDropClaimTokensApp.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
		}

		// Create a usable web3 instance from the found provider
		web3 = new Web3(SparkleAirDropClaimTokensApp.web3Provider);
		// Determine and catch the state where there is no available Web3 provider
		web3.eth.net.isListening().catch(e  => console.error('Web3 not connected!'));
		// Set interval to update every 250ms the "Use address" button's account address text (when changed in metamask/mist/etc)
		var accountInterval = setInterval(function() {
			// Obtain the current account address (metamask uses accounts[0])
			web3.eth.getAccounts().then(result => {
				// Set the button text to reflect the account address obtained
	        	document.getElementById("wallet-address").innerHTML = "Use Address<br/>" + result[0];
	        	// Set the data attribute to store the address value at the attribute level
	        	document.getElementById("wallet-address").setAttribute('data-ethaddress', result[0]);
        	})
		}, 250);

		// Log activity to the console
		console.log("initWeb3: Done!");
		// Return the initialized contract success state
		return SparkleAirDropClaimTokensApp.initContract();
	},

	/**
	 * @title initContract
	 * @description Initialize the Sparke Airdrop contract
	 */
	initContract: function() {
		// Create instance of the airdrop contact using the provided global abi and contract address
		const contract = new web3.eth.Contract(SparkleAirDropClaimTokensApp.abi, SparkleAirDropClaimTokensApp.contractAddress);
		// Attempt to obtain the Sparkle Token address from the Airdrop contract instance (tokenAddress)
		contract.methods.tokenAddress().call((error, result) => { 
			// Determine if there was an error trying to retrieve token address from airdrop contact
			if(error !== null) {
				// Yes, report to the console there was an error
				console.error("initContract[err]: Unable to retrieve Sparkle token address from  airdrop contract.");
				return;
			}

			// Update the html element represented by id="token-address" in the HTML dom
			document.getElementById("token-address").innerHTML = result;
		});
		// Attempt to obtain the number of tokens currently remaining in the airdrop contract
		contract.methods.getTotalTokensRemaining().call((error, result) => {
			// Determine if there was a problem trying to retrieve number of remaining tokens
			if(error !== null) {
				// Yes, report to the console there was an error
				console.error("initContract[err]: Unable to retrieve the number of remaining Sparkle tokens in airdrop");
				// Return preventing any further processing
				return;
			}

			// Calcuate the actual value factoring out Sparkles 8 decimal places (formatted with comma seperators)
			var totalTokensRemaining = (result / 1e8).toLocaleString();
			// Update the html element represented by id="remaining-tokens" in the HTML dom
			document.getElementById('remaining-tokens').innerHTML = totalTokensRemaining;
			// Log activity to the console
			console.log("TokensRemaining: " + totalTokensRemaining);
		});

		// Log activity to the console
		console.log("initContract: Done!");
		// Return the bind events state
		return SparkleAirDropClaimTokensApp.bindEvents();
	},

	/**
	 * @title bindEvents
	 * @description Connects the specified HTML elements with the underlying event structure of the poge DOM
	 */
	bindEvents: function() {
		// Set onClick event on the element with the "btn-clain" class
		$(document).on('click', '.btn-claim', SparkleAirDropClaimTokensApp.handleClaimTokens);
		// Set onClick event on the element with the "btn-useaddress" class
		$(document).on('click', '.btn-useaddress', SparkleAirDropClaimTokensApp.handleUseAddress);
		// Log activity to the console
		console.log("bindEvents: Done!");
	},

	/**
	 * @title handleClaim
	 * @description Process the onClient event received for the Claim Tokens button when clicked
	 */
	handleClaimTokens: function(event) {
		// Indicate that should this event not behandled by this function that is continued to propograte
		event.preventDefault();
		// Grab the address value currently stored in the HTML text box represented by id="inputEthAddress"
		var address = document.getElementById('inputEthAddress').value;
		// Determine if there is any issues with the specified address
		if(address == '' || !web3.utils.isAddress(address)) {
			// yes, there was a problem so indicate there was an error by wraping the textbox border in red
			document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: red;border-width: medium medium medium medium;');
			// Update the html element represetned by id="error-text"
			document.getElementById('error-text').innerHTML = "Invalid address specified!";
			// Unhide the error div/panel
			document.getElementById('error-msg').hidden=false;
			// Set interval to close the div.panel after 5000ms (aprox 5seconds)
			setTimeout(function() {
				// Hide the error div/panel
				document.getElementById('error-msg').hidden=true;
				// Update the html element represented by id="error-text" to be an empty string
				document.getElementById('error-text').innerHTML = "";
				// Update the html element represented by id="inputEthAddress" and remove the red medium border
				document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: ;');
			}, 5000);

			// Log activity to the console
			console.error("handleClaimTokens[err]: An invalid eth address was specified.");
			// Return preventing any further processing
			return;
		}
		else {
			// No, there was no problem, update the html element represented by the id="inputEthAddress" to reset fontsize and border color to normal 
			document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: ;');
		}
		
		// Create an instance of the Sparkle airdrop contract 
		const contract = new web3.eth.Contract(SparkleAirDropClaimTokensApp.abi, SparkleAirDropClaimTokensApp.contractAddress) // define airdrop contract object
		// Attempt to determine if the specified account address is listed in the airdrop list
		contract.methods.isAddressInAirdropList(address).call((err, result) => { 
			// Determine if there was a problem
			if(err !== null) {
				// Yes, there was a problem so report to console
				console.error("isAddressInAirDropList[err]: " + err);
				// Return preventing any further processing
				return;
			}

			// Determine if the address was actually in the airdrop rewards list
			if(!result) {
				// Update the html element represented by id="error-text" to reflect the error encountered
				document.getElementById('error-text').innerHTML = "Address not found in Airdrop";
				// No, the address was not found so unhide the error div/panel represted by id="error-msg"
				document.getElementById('error-msg').hidden=false;
				// Set time interval to close the error div/panel after 5000 ms (5 seconds)
				setTimeout(function() {
					// Hide the html element represented by id="error-text"
					document.getElementById('error-msg').hidden=true;
					// update the html element represtned by the id ="error-msg"
					document.getElementById('error-text').innerHTML = "";
					// Update the html element represented by id="inputEthAddress" and remove the red medium border
					document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: ;');
				}, 5000);

				// Log activity to the console
				console.error("handleClaimTokens[err]: Specified address not found in airdrop list");
				// Return preventing and further processing
				return;
			}

			// Update the html element represented by id="info-text" to reflect a successfull response
			document.getElementById('info-text').innerHTML = "Address found in Airdrop list";
			// Update the html element represented by id="info-msg" to unhide the info/panel
			document.getElementById('info-msg').hidden=false;
			// Set time interval to hide the info/panel after 5000 ms (5 seconds)
			setTimeout(function() {
				// Hide the html element represented by id="info-msg"
				document.getElementById('info-msg').hidden=true;
				// Update html element represented by id="indo-text" to clear any text
				document.getElementById('info-text').innerHTML = "";
				// Update html element represented by if="inputEthAddress" to remove the red medium border
				document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: ;');
			}, 5000);

			// Log  activity to the console
			console.log("handleClaimTokens[true]: Found \"" + result + "\" in airdrop list");
		});

		// Attempt to claimTokens for the specified account address
		contract.methods.claimTokens().send({from: address}, function(error, transactionHash) { 
			// Determine if there was a problem claiming tokens
			if(error !== null) {
				// Yes, there was a problem so update the html element represetned by id="error-text" to reflect the error
				document.getElementById('error-text').innerHTML = "There was a problem and the tokens were not claimed successfully.";
				// Unhide the error/panel represented by id="error-msg" html element
				document.getElementById('error-msg').hidden=false;
				// Set time interval to hide the error/panel after 5000ms (5 seconds)
				setTimeout(function() {
					// Update the html element represented by id="error-msg" and hide the error/panel
					document.getElementById('error-msg').hidden=true;
					// Update the html element represented by id="error-text" and clear any text
					document.getElementById('error-text').innerHTML = "";
					// Update the html element represented by id="inputEthAddress" to remove red medium border
					document.getElementById('inputEthAddress').setAttribute('style', 'font-size: 12pt; border-color: ;');
				}, 5000);

				// Log activity to the console
				console.error("handleClaimTokens[err]: There was an error claiming tokens.");
				// Return preventing any further processing
				return;
			}

			// Tokens have sucessfully been claimed so update the the html element represented by id="popup-header-text"
			document.getElementById('popup-header-text').innerHTML = "Congratulations!";
			// Update html element represented by id="popup-body-text" with welcome text, success message
			document.getElementById('popup-body-text').innerHTML = "<p>Welcome to the growing Sparkle family!</p><p>You have successfully claimed your Sparkle Tokens.</p>";
			// Update html element represented by id="popup-txhash-text" with the txhash value and create a link to etherscan for the txhash
			document.getElementById('popup-txhash-text').innerHTML = "<p class=\"smallesttext\">Your Transaction Hash<br/><a target=\"_blank\" href=\"https://etherscan.io/tx/0x50faef72a2c69d537fa58178f7cf324f5fea39a9cb57c6050b02edef1e9b3fd4\">0x50faef72a2c69d537fa58178f7cf324f5fea39a9cb57c6050b02edef1e9b3fd4</a></p>";
			// Display the modal popup panel
			$("#myModal").modal();
		});

		// Log activity to the console
		console.log("handleClaimTokens: Done!");
		return;
	},

	/**
	 * @title handleUseAddress
	 * @description Process the onClick event received for the "Use Address" button
	 */
	handleUseAddress: function(event) {
		// Indicate that should this event not behandled by this function that is continued to propograte
		event.preventDefault();
		// Update the html element represented by id="inputEthAddress" with the data attribute stored earlier on the textbox element
		document.getElementById("inputEthAddress").value = document.getElementById("wallet-address").getAttribute('data-ethaddress');
		// Log activity to the console
		console.log("handleUseAddress: Done!");
	},
};

/**
 * @title function()
 * @description OnLoad injection for the currently loaded page
 */
$(function() {
	// When windows.load is called (handled by the browser)
	$(window).load(function() {
		// Initialize and run the Sparkle Token Airdrop Dapp
		SparkleAirDropClaimTokensApp.init();
	});
});
