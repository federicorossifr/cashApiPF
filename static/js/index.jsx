console.log("Index")

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
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
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
            <div>
                <h1 className="display-4">Saldo: {summary.in + summary.out}</h1>
                <p className="lead"><label style={{color:"green"}}>In: {summary.in}</label><br></br> 
                <label style={{color:"red"}}>Out: {summary.out}</label></p>
            </div>
        )
    }
}

class MainDashboard extends React.Component {
    constructor(props) {
        super(props)
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
        this.cashApiClient.allTransactions().then(result => 
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
                {this.state.isLoaded && <Summary elements={this.state.elements}/>}
                <br></br><br></br>
                <input className="form-control" value={this.state.searchInput} onChange={this.onSearchChange} placeholder="Search..."></input>
                {!this.state.isLoaded && <label>Loading...</label>}
                {this.state.isLoaded && <ItemList elements={this.state.viewElements} removeCallback={this.handleRemove} />}
            </div>
        )
    }
}


ReactDOM.render(
    <MainDashboard />,
    document.getElementById("root")
)