import React from "react";
import Navbar from "./NavBar";
import AccountDetails from "./pages/AccountTransactionDetails";
import TransactionImporter from "./pages/TransactionImporter";
import CashApiClient from './cashAPIClient'
import { Route, Switch } from "react-router-dom";
import HomeCharts from "./pages/HomeCharts";







class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            accountList:{
                accounts:[],
                accountsReady:false
            }
        }
        this.cashApiClient = new CashApiClient("/")
        this.onNewAccountSubmitted = this.onNewAccountSubmitted.bind(this)
    }


    componentDidMount() {
        this.cashApiClient.allAccounts().then( (accounts) => {
            this.setState({accountList:{accounts:accounts,accountsReady:true}})
        })
    }

    onNewAccountSubmitted(account) {
        this.componentDidMount()
    }

     render() {
         return (
            <main className="flex">
            {this.state.accountList.accountsReady && <Navbar accountList={this.state.accountList} cashApiClient={this.cashApiClient} onNewAccountSubmitted={this.onNewAccountSubmitted}/>}
            <div className="d-flex flex-column flex-grow-1 p-3 account-summary">
                <Route exact path="/">
                <div className="card bg-dark my-card text-white mb-3">
                    <h1 className="display-4">Home</h1>
                </div>
                </Route>

                <Switch>
                    <Route exact path="/"><HomeCharts accountList={this.state.accountList} cashApiClient={this.cashApiClient} /></Route>
                    <Route exact path="/accounts/:accountId/"><AccountDetails cashApiClient={this.cashApiClient} /></Route>
                    <Route exact path="/import"><TransactionImporter cashApiClient={this.cashApiClient} accountList={this.state.accountList} /></Route>
                </Switch>
    
    
            </div>
            </main>
        )
     }
}

export default App