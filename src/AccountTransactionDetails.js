import React from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker  from "react-datepicker";
import { parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import format from 'date-fns/format';

class ItemList extends React.Component {

    formatDate(dateString) {
        let parsed = parseISO(dateString)
        let formatted = format(parsed,"dd.MM.yyyy")
        return formatted;
    }

    renderItems() {
        const items = this.props.elements.map((element,index) => 
            <tr key={element._id}>
                <td>{this.formatDate(element.date)}</td>
                <td className={element.amountIn ? "moneyIn":"moneyOut"}>{element.amountIn ? element.amountIn:element.amountOut}€</td>
                <td>{element.type}</td>
                <td>{element.category}</td>
                <td>{element.description}</td>
            </tr>
        )
        return items
    }

    render() {
        return (
            <table className="table  table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Data</th>
                        <th>Importo</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>Descrizione</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderItems()}
                </tbody>
            </table>
        )
    }
}

class Summary extends React.Component {

    computeSummary() {
        if(this.props.elements.length < 1) return {'in':0,'out':0}
        let incomes = this.props.elements.map((el) => (el.amountIn? el.amountIn:0))
        let outcomes = this.props.elements.map((el) => (el.amountOut? el.amountOut:0))

        return {
            'in':incomes.reduce((acc,el)=>acc+el),
            'out':outcomes.reduce((acc,el)=>acc+el)
        }
    }

    render() {
        let summary = this.computeSummary()
        return (
            <div class="card bg-dark my-card text-white ">
                <h1 className="display-4">Saldo: {summary.in + summary.out}<i class="bi bi-currency-euro"></i></h1>
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

    render() {

        return (
            <form onSubmit={this.onFormSubmit}>
                <div className="my-form-row">
                    <div className="input-group">
                        <span class="input-group-text"><i class="bi bi-currency-euro"></i></span>
                        <input name="amount" value={this.state.amountInput} type="number" step="0.01" class="form-control" placeholder="Importo" onChange={this.onInputChange}></input>
                    </div>
                    <DatePicker  selected={this.state.dateInput} className="form-control" onChange={this.onDatePickerChange} />
                    <input name="category" value={this.state.categoryInput} type="text" class="form-control" placeholder="Categoria" onChange={this.onInputChange}></input>

                </div>

                <div className="my-form-row">
                    <input name="description" value={this.state.descriptionInput} type="text" class="form-control" placeholder="Descrizione" onChange={this.onInputChange}></input>
                    <input name="type" value={this.state.typeInput} type="text" class="form-control" placeholder="Tipo" onChange={this.onInputChange}></input>
                </div>

                <div className="my-form-row">
                    <button type="submit" class="form-control btn btn-dark">Aggiungi</button>
                </div>
            </form>
        )
    }
}

class AccountTransactionDetails extends React.Component {
    constructor(props) {
        super(props)
        console.log("Inited dashboard")
        this.state = {
            elements:[],
            viewElements:[],
            isLoaded:false,
            searchInput:""
        } 
        this.cashApiClient = new CashApiClient("/")
        this.addItem = this.addItem.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
    }

    componentDidMount() {
        this.cashApiClient.allAccountTransactions(this.props.accountId).then(result => 
        {
            let sorted = result.sort((a,b) => {
                return (new Date(a.date) < new Date(b.date));
            })
            console.log(sorted)
            this.setState({
                elements:sorted,
                viewElements:sorted,
                isLoaded:true
            })
        })
    }



    addItem(transactionItem) {
        transactionItem["accountId"] = this.props.accountId
        this.cashApiClient.addAccountTransaction(this.props.accountId,transactionItem).then(res =>{
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
                    <NewTransactionForm addItemCallback={this.addItem} />
                </div>

                <br></br>
                
                <div className="row">
                    <div className="col-2">
                        <input className="bg-dark form-control text-white my-search-input" value={this.state.searchInput} onChange={this.onSearchChange} placeholder="Cerca movimento"></input>
                    </div>
                </div>



                {!this.state.isLoaded && <label>Loading...</label>}
                <div className="row">
                    <div className="col">
                        {this.state.isLoaded && <ItemList elements={this.state.viewElements} removeCallback={this.handleRemove} />}
                    </div>
                </div>
                
            </div>
        )
    }
}


const accountId = document.getElementById("root").getAttribute("data-account-id")
ReactDOM.render(
    <AccountTransactionDetails accountId={accountId}/>,
    document.getElementById("root")
)