import React from "react";
import Navbar from "./NavBar";
import AccountDetails from "./pages/AccountTransactionDetails";
import CashApiClient from './cashAPIClient'
import { Link, Route, Switch, useParams  } from "react-router-dom";

const Home = () => {
    return (<div>This is home</div>)
}





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
    }


    componentDidMount() {
        this.cashApiClient.allAccounts().then( (accounts) => {
            this.setState({accountList:{accounts:accounts,accountsReady:true}})
        })
    }

     render() {
         return (
            <main className="flex">
            {this.state.accountList.accountsReady && <Navbar accountList={this.state.accountList} />}
            <div className="d-flex flex-column flex-grow-1 p-3 account-summary">
                <Route exact path="/">
                <div className="card bg-dark my-card text-white mb-3">
                    <h1 className="display-4">Home</h1>
                </div>
                </Route>

                <Switch>
                    <Route exact path="/"><Home /></Route>
                    <Route exact path="/accounts/:accountId/"><AccountDetails cashApiClient={this.cashApiClient} /></Route>
                </Switch>
    
    
            </div>
            </main>
        )
     }
}

export default App