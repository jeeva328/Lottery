import React from "react";
import web3 from "./web3";
import lot from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    console.log(`accounts[0]`, accounts[0]);

    const manager = await lot.methods.manager().call({from : accounts[0]});
    console.log(manager);

    const players = await lot.methods.getPlayers().call({
      from: accounts[0],
    });
    console.log(players);

    const balance = await web3.eth.getBalance(lot.options.address);
    console.log(balance);

    this.setState({ manager , players , balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lot.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lot.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

   render() {
  //   console.log(this.state.players);
  //   console.log(this.state.manager);
  //   console.log(this.state.balance);
    return (
      <div>
        <h2> Lottery Contract </h2>{" "}
        <p>
          This contract is managed by {this.state.manager}.There are currently{" "}
          {this.state.players.length}
          people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")}
          ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck ? </h4>{" "}
          <div>
            <label> Amount of ether to enter </label>{" "}
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />{" "}
          </div>{" "}
          <button> Enter </button>{" "}
        </form>
        <hr />
        <h4> Ready to pick a winner ? </h4>{" "}
        <button onClick={this.onClick}> Pick a winner! </button>
        <hr />
        <h1> {this.state.message} </h1>{" "}
      </div>
    );
  }
}
export default App;