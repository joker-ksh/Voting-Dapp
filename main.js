let WALLET_CONNECTED = "";
let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandiates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getVotesOfCandiate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newDurationInMinutes",
          "type": "uint256"
        }
      ],
      "name": "resetVotingTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_additionalMinutes",
          "type": "uint256"
        }
      ],
      "name": "extendVotingTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCandidateCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "getUserVote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  document.getElementById("metamasknotification").innerText = "Metamask is connected " + WALLET_CONNECTED;
};

const addVote = async () => {
  if (WALLET_CONNECTED != "") {
    var inputElement = document.getElementById("vote");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    document.getElementById("cand").innerText = "Please wait, adding a vote in the smart contract";
    try {
      const tx = await contractInstance.vote(inputElement.value);
      await tx.wait();
      document.getElementById("cand").innerText = "Vote added !!!";
    } catch (error) {
      console.error("Error voting:", error);
      document.getElementById("cand").innerText = "Vote failed. Check console.";
    }
  } else {
    document.getElementById("cand").innerText = "Please connect metamask first";
  }
};

const voteStatus = async () => {
  if (WALLET_CONNECTED != "") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      const currentStatus = await contractInstance.getVotingStatus();
      const time = await contractInstance.getRemainingTime();
      document.getElementById("status").innerText = currentStatus ? "Voting is currently open" : "Voting is finished";
      document.getElementById("time").innerText = `Remaining time is ${time.toString()} seconds`;
    } catch (error) {
      console.error("Error fetching voting status:", error);
      document.getElementById("status").innerText = "Error fetching voting status";
    }
  } else {
    document.getElementById("status").innerText = "Please connect metamask first";
  }
};

const getAllCandidates = async () => {
  if (WALLET_CONNECTED != "") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider);
    document.getElementById("p3").innerText = "Please wait, fetching candidates from the voting smart contract";
    try {
      const candidates = await contractInstance.getAllVotesOfCandiates();
      console.log("Candidates data:", candidates);
      const table = document.getElementById("myTable");
      table.innerHTML = `<tr><th>Index</th><th>Name</th><th>Vote Count</th></tr>`;
      for (let i = 0; i < candidates.length; i++) {
        let row = table.insertRow();
        row.insertCell().innerText = i;
        row.insertCell().innerText = candidates[i].name;
        row.insertCell().innerText = candidates[i].voteCount.toString();
      }
      document.getElementById("p3").innerText = "Candidates list updated!";
    } catch (error) {
      console.error("Error fetching candidates:", error);
      document.getElementById("p3").innerText = "Error fetching candidates. Check console.";
    }
  } else {
    document.getElementById("p3").innerText = "Please connect metamask first";
  }
};

const resetTime = async () => {
  if (WALLET_CONNECTED != "") {
    // Prompt the user for new duration (in minutes)
    let newDuration = prompt("Enter new voting duration in minutes:");
    if (!newDuration || isNaN(newDuration)) {
      alert("Invalid duration input!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    document.getElementById("resetNotification").innerText = "Resetting voting time...";
    try {
      const tx = await contractInstance.resetVotingTime(newDuration);
      await tx.wait();
      document.getElementById("resetNotification").innerText = "Voting time reset successfully!";
    } catch (error) {
      console.error("Error resetting voting time:", error);
      document.getElementById("resetNotification").innerText = "Failed to reset voting time.";
    }
  } else {
    document.getElementById("resetNotification").innerText = "Please connect metamask first";
  }
};

// Expose functions to the global window so that they can be called from HTML
window.connectMetamask = connectMetamask;
window.addVote = addVote;
window.voteStatus = voteStatus;
window.getAllCandidates = getAllCandidates;
window.resetTime = resetTime;
