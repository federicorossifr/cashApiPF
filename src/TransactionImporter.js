import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'
import ItemList from './TransactionList'
import {BootStrapToast, getToasts} from './BootStrapToast'

class TransactionImporter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accounts:[],
            selectedAccountId:"",
            toImport:[],
            reviewReady:false,
        }
        this.cashApiClient = new CashApiClient("/")
        this.startImport = this.startImport.bind(this)
        this.onAccountSelectedChange = this.onAccountSelectedChange.bind(this)
        this.commitImport = this.commitImport.bind(this)
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
        this.cashApiClient.uploadAccountTransactions(this.state.selectedAccountId,toUpload).then((res) => {
            this.setState({reviewReady:true,toImport:res,toNotify:true})
        })

    }

    commitImport() {
        this.cashApiClient.addAccountTransaction(this.state.selectedAccountId,this.state.toImport).then((res) => {
            this.setState({reviewReady:false,toImport:[]})
            getToasts()[0].show()
        })
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
                <div>
                 {this.state.reviewReady && <ItemList elements={this.state.toImport} />}
                 {this.state.reviewReady && <button onClick={this.commitImport} className="btn btn-success my-float-btn"><i class="bi bi-check-circle-fill"></i> Conferma</button> }

                </div>
                <BootStrapToast id="notify-toast" title="Importazione movimenti" message="Importazione completata" />
            </div>
        )
    }
}
ReactDOM.render(
    <TransactionImporter />,
    document.getElementById("importContainer")
)

