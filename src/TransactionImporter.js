import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'

class TransactionImporter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accounts:[],
            selectedAccountId:""
        }
        this.cashApiClient = new CashApiClient("/")
        this.startImport = this.startImport.bind(this)
        this.onAccountSelectedChange = this.onAccountSelectedChange.bind(this)
    }

    componentDidMount() {
        this.cashApiClient.allAccounts().then( (accounts) => {
            this.setState({accounts:accounts, isLoaded:true, selectedAccountId: accounts[0]._id})
        })
    }

    onAccountSelectedChange(event) {
        console.log(event.target.value)
        this.setState({selectedAccountId:event.target.value})
    }

    renderAccountSelections() {
        let items = this.state.accounts.map((acc,index) => 
            <option key={acc._id} value={acc._id}>{acc.name}</option>
        )
        return items;
    }

    startImport(event) {
        event.preventDefault()
        let toUpload = event.target.children[0].files[0]
        console.log(toUpload)
        this.cashApiClient.uploadAccountTransactions(this.state.selectedAccountId,toUpload)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.startImport} method="post" enctype="multipart/form-data">
                    <input required class="form-control" type="file" name="transactionFile" />
                    <select value={this.state.selectedAccountId} class="form-select"  onChange={this.onAccountSelectedChange}>
                        {this.renderAccountSelections()}
                    </select>
                    <button class="form-control btn-dark" type="submit">Importa</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(
    <TransactionImporter />,
    document.getElementById("importContainer")
)

