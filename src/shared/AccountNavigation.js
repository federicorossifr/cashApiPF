import React from 'react'
import ReactDOM from 'react-dom'



class NewAccountForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newFormShowing:false,
        }
        this.keys = { "enter": 13 }
        this.onNewAccountClick = this.onNewAccountClick.bind(this)
        this.onInputEnterPress = this.onInputEnterPress.bind(this)
    }


    onNewAccountClick(event) {
        event.preventDefault();
        this.setState({newFormShowing:true})
    }

    submitNewAccount(accountName) {
        this.props.cashApiClient.addAccount({name:accountName}).then( (res) => {
            this.setState({newFormShowing:false})
            this.props.onNewAccountSubmitted(res)
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
        let entries = [];
        if(!this.state.newFormShowing)
        entries.push(
            <li key={-1} class="nav-item mt-1">
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
            {this.renderAccountsEntries()}
        </div>)
    }

}

export default NewAccountForm