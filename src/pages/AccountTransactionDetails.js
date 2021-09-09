import React from 'react'
import ReactDOM from 'react-dom'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker  from "react-datepicker";
import ItemList from '../shared/TransactionList.js'
import { withRouter } from "react-router-dom";

class Summary extends React.Component {

    computeSummary() {
        if(this.props.elements.length < 1) return {'in':0,'out':0}
        let incomes = this.props.elements.map((el) => (el.amountIn? el.amountIn:0))
        let outcomes = this.props.elements.map((el) => (el.amountOut? el.amountOut:0))
        let totIn = incomes.reduce((acc,el)=>acc+el);
        let totOut = outcomes.reduce((acc,el)=>acc+el);
        return {
            'in':Number(totIn.toFixed(2)),
            'out':Number(totOut.toFixed(2)),
            'net':Number((totIn+totOut).toFixed(2))
        }
    }

    render() {
        let summary = this.computeSummary()
        return (
            <div class="card bg-dark my-card text-white ">
                <h1 className="display-4">Saldo: {summary.net}<i class="bi bi-currency-euro"></i></h1>
                <p className="lead">
                    <label style={{color:"green"}}><i class="bi bi-plus-circle-fill"></i></label> {summary.in}<i class="bi bi-currency-euro"></i><br></br> 
                    <label style={{color:"red"}}><i class="bi bi-dash-circle-fill"></i></label> {Math.abs(summary.out)}<i class="bi bi-currency-euro"></i>
                </p>
            </div>
        )
    }
}

class NewTransactionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            amountInput:"",
            typeInput:"",
            descriptionInput:"",
            categoryInput:"",
            dateInput: new Date()
        }

        this.onDatePickerChange = this.onDatePickerChange.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onDatePickerChange(date) {
        this.setState({dateInput:date})
    }

    onInputChange(event) {
        switch (event.target.name) {
            case "amount":
                this.setState({amountInput:event.target.value})
                break;
            case "category":
                this.setState({categoryInput:event.target.value})
                break;
            case "description":
                this.setState({descriptionInput:event.target.value})
                break;
            case "type":
                this.setState({typeInput:event.target.value})
                break;
        }
    }

    onFormSubmit(event) {
        event.preventDefault();
        let transaction = {
            'date':this.state.dateInput,
            'description':this.state.descriptionInput,
            'amountIn': (this.state.amountInput > 0) ? parseInt(this.state.amountInput): null,
            'amountOut': (this.state.amountInput < 0) ? parseInt(this.state.amountInput): null,
            'type': this.state.typeInput,
            'category': this.state.categoryInput
        }
        this.props.addItemCallback(transaction)
    }

    renderCategoryDatalist() {
        return (
        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
            <input name="category" onChange={this.onInputChange} value={this.state.categoryInput} class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Categoria" aria-describedby="basic-addon1" />
            <datalist id="datalistOptions">
                {this.props.distinctCategories.map((cat) => <option value={cat} />)}
            </datalist>
        </div>
        )
    }

    render() {

        return (
            <form onSubmit={this.onFormSubmit}>
                <div className="container">
                    <div className="row mb-1">
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <div className="input-group">
                                <span class="input-group-text"><i class="bi bi-currency-euro"></i></span>
                                <input name="amount" value={this.state.amountInput} type="number" step="0.01" class="form-control" placeholder="Importo" onChange={this.onInputChange}></input>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <DatePicker  selected={this.state.dateInput} className="form-control" onChange={this.onDatePickerChange} />
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <input name="description" value={this.state.descriptionInput} type="text" class="form-control" placeholder="Descrizione" onChange={this.onInputChange}></input>
                        </div>
                    </div>

                    <div className="row mb-1">
                        {this.renderCategoryDatalist()}
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <input name="type" value={this.state.typeInput} type="text" class="form-control" placeholder="Tipo" onChange={this.onInputChange}></input>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <button type="submit" class="form-control btn btn-dark">Aggiungi</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

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
                    {this.state.isLoaded && <NewTransactionForm distinctCategories={this.state.distinctCategories} addItemCallback={this.addItem} />}
                </div>

                <br></br>
                
                {this.state.isLoaded &&
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                        <input className="bg-dark form-control text-white my-search-input" value={this.state.searchInput} onChange={this.onSearchChange} placeholder="Cerca movimento"></input>
                    </div>
                </div>}



                <div className="row">
                    <div className="col">
                        {this.state.isLoaded && <ItemList elements={this.state.viewElements} removeCallback={this.handleRemove} />}
                    </div>
                </div>
                
            </div>
        )
    }
}


export default withRouter(AccountDetails)