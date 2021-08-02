import { Tabs, Tab } from "react-bootstrap";
import dBank from "../abis/dBank.json";
import React, { useState, useEffect } from "react";
import Token from "../abis/Token.json";
import Web3 from "web3";
import "./App.css";

function App() {
  const [state, setState] = useState({
    web3: "undefined",
    account: "",
    token: null,
    dbank: null,
    balance: 0,
    dBankAddress: null,
  });

  const [symbol, setSymbol] = useState("");
  const [interest, setInterest] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      //check if MetaMask exists
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const netId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();

        if (typeof accounts[0] !== "undefined") {
          const balance = await web3.eth.getBalance(accounts[0]);

          try {
            // Load Contracts

            const token = new web3.eth.Contract(
              Token.abi,
              Token.networks[netId].address
            );

            const symbol = await token.methods.symbol().call();
            setSymbol(symbol);

            const interest = await token.methods.balanceOf(accounts[0]).call();
            setInterest(web3.utils.fromWei(interest));
            const dbank = new web3.eth.Contract(
              dBank.abi,
              dBank.networks[netId].address
            );

            const dBankAddress = dBank.networks[netId].address;

            setState({
              web3,
              account: accounts[0],
              token,
              dbank,
              balance,
              dBankAddress,
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          window.alert("Please login in metamask");
        }
      } else {
        window.alert("Please install Metamask");
      }
      
    };

    loadBlockchainData();
  }, []);

  async function deposit(amount) {
   
    if (typeof state.dbank !== "undefined") {
      try {
        await state.dbank.methods
          .deposit()
          .send({ value: amount.toString(), from: state.account });
      } catch (error) {
        console.log("ERROR: ", error.message);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    deposit(amount * 10 ** 18); //convert amount to wei
  };

  async function withdraw(e) {
    e.preventDefault();
    if (typeof state.dbank !== "undefined") {
      try {
        await state.dbank.methods.withdraw().send({ from: state.account });
        window.alert("Success");
        window.location.reload();
      } catch (error) {
        console.log("ERROR");
      }
    }
  }

  return (
    <div className="text-monospace">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand text-center col-sm-12 mr-0"
          href="https://tupaginaonline.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>
            <i className="text-warning">JFDESOUSA</i> Descentralized Bank
          </b>
        </a>
      </nav>
      <div className="container-fluid mt-5 text-center">
        <br></br>
        <h2>
          Welcome to my decentralized bank where you will earn JFDS tokens
          <code></code>
        </h2>
        <h4>
          <i className="h6 text-warning">Your address: </i>
          {state.account}
        </h4>
        <br></br>
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div className="pt-2">
                    How much do you want to deposit?
                    <br></br>
                    (the minimum deposit is 0.01 ETH)
                    <br></br>
                    (1 deposit is posible at the time)
                    <form onSubmit={handleSubmit}>
                      <div className="form-group pt-3 pb-3">
                        <input
                          required
                          placeholder="amount..."
                          type="number"
                          step="0.01"
                          min="0.01"
                          onChange={(e) => setAmount(e.target.value)}
                          className="from-control form-control-md"
                        />
                      </div>
                      <button className="btn btn-primary" type="submit">
                        DEPOSIT
                      </button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <div className="pt-3">
                    Do you want withdraw + take interest?
                    <br></br>
                    <button className="btn btn-success mt-3" onClick={withdraw}>
                      WITHDRAW
                    </button>
                  </div>
                </Tab>
                <Tab eventKey="interest" title={`${symbol} token balance`}>
                  <div className="pt-3">
                    <div className="alert alert-info">
                      You have <b>{interest}</b> <code>{symbol}</code>{" "}
                      <i>earned</i>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
