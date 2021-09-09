import React from "react";
import Navbar from "./NavBar";
import AccountDetails from "./pages/AccountTransactionDetails";
import TransactionImporter from "./pages/TransactionImporter";
import AccountInfo from './pages/AccountInfo'
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
            },
            shouldNavShowFull:false
        }
        this.cashApiClient = new CashApiClient("/")
        this.setNavShow = this.setNavShow.bind(this)
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

    hasAccounts() {
        return this.state.accountList.accountsReady && this.state.accountList.accounts.length > 0;
    }

    setNavShow() {
        let state = this.state.shouldNavShowFull
        this.setState({
            shouldNavShowFull:!state
        })
    }

     render() {
         return (
            <main className="flex">
            <button onClick={this.setNavShow} className="d-md-none btn btn-dark text-white position-absolute top-0 start-0 ham-menu"><i class="bi bi-list"></i></button>
            {this.state.accountList.accountsReady && <Navbar setNavShow={this.setNavShow} shouldNavShowFull={this.state.shouldNavShowFull} accountList={this.state.accountList} cashApiClient={this.cashApiClient} onNewAccountSubmitted={this.onNewAccountSubmitted}/>}
            <div className="d-flex flex-column flex-grow-1 p-3 account-summary">
                <Route exact path="/">
                <div className="card bg-dark my-card text-white mb-3">
                    <h1 className="display-4">Home</h1>
                </div>
                </Route>

                <Switch>
                    <Route exact path="/">
                        {this.hasAccounts() && 
                        <HomeCharts accountList={this.state.accountList} cashApiClient={this.cashApiClient} />
                        }
                    </Route>
                    <Route exact path="/accounts/:accountId/"><AccountDetails cashApiClient={this.cashApiClient} /></Route>
                    <Route exact path="/accounts/:accountId/settings">
                        {this.state.accountList.accountsReady &&
                        <AccountInfo onAccountUpdate={this.onNewAccountSubmitted} accountList={this.state.accountList} cashApiClient={this.cashApiClient} />
                        }
                    </Route>
                    <Route exact path="/import">
                        {this.hasAccounts() &&
                        <TransactionImporter cashApiClient={this.cashApiClient} accountList={this.state.accountList} />
                        }
                    </Route>
                </Switch>
    
    
            </div>
            </main>
        )
     }
}

export default App