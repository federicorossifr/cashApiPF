import React from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'

class ItemList extends React.Component {
    renderItems() {
        const items = this.props.elements.map((element,index) => 
            <tr key={element._id}>
                <td>{element.date}</td>
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
            this.setState({
                elements:result,
                viewElements:result,
                isLoaded:true
            })
        })
    }



    addItem() {
        let elements = this.state.elements
        let newid = this.state.uuid+1
        elements.push({'id':newid,'name':this.state.newItemInput})
        this.setState({
            elements:elements,
            viewElements:elements,
            uuid:newid,
            searchInput:""
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
                    <div className="col-2">
                        <input className="bg-dark form-control text-white my-search-input" value={this.state.searchInput} onChange={this.onSearchChange} placeholder="Cerca movimento"></input>
                    </div>
                    <div className="col-2 my-add-btn-wrap">
                        <button type="button" class="btn btn-dark my-add-btn">Aggiungi</button>
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