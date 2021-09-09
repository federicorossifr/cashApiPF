import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import ItemList from '../widgets/TransactionList.js'
import NewTransactionForm from '../widgets/TransactionForm.js';
import Summary from '../widgets/AccountSummary.js';
import { withRouter } from "react-router-dom";


class AccountDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            elements:[],
            viewElements:[],
            isLoaded:false,
            searchInput:"",
            distinctCategories:[]
        } 

        this.cashApiClient = this.props.cashApiClient
        this.addItem = this.addItem.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
    }

    componentDidMount() {
        this.cashApiClient.allAccountTransactions(this.props.match.params.accountId).then(result => 
        {
            let sorted = result.sort((a,b) => {
                return (new Date(a.date) < new Date(b.date));
            })
            
            let categories = result.map((el) => el.category)
            let distinctCategories = Array.from(new Set(categories))
            this.setState({
                elements:sorted,
                viewElements:sorted,
                isLoaded:true,
                distinctCategories:distinctCategories
            })
        })
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps)
        if(prevProps.match.params.accountId != this.props.match.params.accountId) {
            this.componentDidMount()
        }
    }



    addItem(transactionItem) {
        transactionItem["accountId"] = this.props.match.params.accountId
        this.cashApiClient.addAccountTransaction(this.props.match.params.accountId,[transactionItem]).then(res =>{
            this.componentDidMount()
        })
    }


    onSearchChange(event) {
        let searchTerm = event.target.value
        let newView = this.state.elements.filter((el)=>{
            let name = el.description.toLowerCase()
            return name.includes(searchTerm.toLowerCase())
        })
        this.setState({viewElements:newView,searchInput:searchTerm})
    }

    render() {
        return (
            <div className="mainDashboard">
                <div className="row">
                    <div className="col">
                        {this.state.isLoaded && <Summary elements={this.state.elements}/>}
                    </div>
                </div>
                <br></br><br></br>

                <div className="row">
                    {this.state.isLoaded && <NewTransactionForm cashApiClient={this.cashApiClient} distinctCategories={this.state.distinctCategories} addItemCallback={this.addItem} />}
                </div>

                <br></br>
                
                {this.state.isLoaded &&
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                        <input className="bg-dark form-control text-white my-search-input" value={this.state.searchInput} onChange={this.onSearchChange} placeholder="Cerca movimento"></input>
                    </div>
                </div>}



                <div className="row">
                    <div className="col overflow-auto">
                        {this.state.isLoaded && <ItemList elements={this.state.viewElements} removeCallback={this.handleRemove} />}
                    </div>
                </div>
                
            </div>
        )
    }
}


export default withRouter(AccountDetails)