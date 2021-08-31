import React from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'



class AccountNavigation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            accounts:[],
            isLoaded:true,
            newFormShowing:false,
        }
        this.keys = {
            "enter": 13
        }
        this.cashApiClient = new CashApiClient("/")
        this.onNewAccountClick = this.onNewAccountClick.bind(this)
        this.onInputEnterPress = this.onInputEnterPress.bind(this)
    }


    componentDidMount() {
        this.cashApiClient.allAccounts().then( (accounts) => {
            console.log(accounts)
            this.setState({accounts:accounts, isLoaded:true})
        })
    }

    onNewAccountClick(event) {
        event.preventDefault();
        this.setState({newFormShowing:true})
    }

    submitNewAccount(accountName) {
        console.log(accountName)
        this.cashApiClient.addAccount({name:accountName}).then( (res) => {
            let oldEls = this.state.accounts
            oldEls.push({name:accountName,_id:res.insertedId})
            this.setState({newFormShowing:false, accounts:oldEls})
        })
    }

    onInputEnterPress(event) {
        let keyCode = event.charCode;
        console.log(keyCode)
        if(keyCode == this.keys["enter"]) {
            this.submitNewAccount(event.target.value)
            event.target.value = ""
        }

    }


    renderAccountsEntries() {
        let entries = this.state.accounts.map( (account) => { 
            let anchorClassName = (account._id == this.props.activeAccount) ? "nav-link active":"nav-link text-white"
            return(
            <li key={account._id} class="nav-item">
                <a href={"./accounts/" + account._id} className={anchorClassName} >
                    <i class="bi bi-wallet"></i>  {account.name}
                </a>
            </li>)
        })

        if(!this.state.newFormShowing)
        entries.push(
            <li key={-1} class="nav-item">
                <a onClick={this.onNewAccountClick} href="#" class="nav-link text-white my-new-account" >
                    <i class="bi bi-file-earmark-plus"></i>  Aggiungi nuovo
                </a>
            </li>
        )
        else
        entries.push(
            <li key={-1} class="nav-item">
                <input onKeyPress={this.onInputEnterPress} className="form-control navbar-form-control" type="text" placeholder="Nome account"></input>
            </li>
        )

        return entries;
    }

    render() {
        return (<div>
            {this.state.isLoaded && this.renderAccountsEntries()}
        </div>)
    }

}


document.body.onload = () => {
    let url = window.location.href;
    let activeId = ''
    if(url.includes("accounts"))
    activeId = document.getElementById("root").getAttribute("data-account-id")
    ReactDOM.render(
        <AccountNavigation activeAccount={activeId}/>,
        document.getElementById("navbar-account")
    )
}
