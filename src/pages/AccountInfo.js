import React from "react";
import { withRouter } from "react-router-dom";


class AccountInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            renameInputVal:this.getAccountNameFromId(this.props.match.params.accountId),
            accountId:this.props.match.params.accountId
        }
        this.onRenameInputChange = this.onRenameInputChange.bind(this)
        this.onRenameFormSubmit = this.onRenameFormSubmit.bind(this)
        this.onDeleteAccount = this.onDeleteAccount.bind(this)

    }

    onRenameFormSubmit(event) {
        event.preventDefault();
        let newAccount = {name:this.state.renameInputVal}
        this.props.cashApiClient.updateAccount(this.state.accountId,newAccount).then((res) => {
            this.props.onAccountUpdate()
        })
    }

    onRenameInputChange(event) {
        this.setState({
            renameInputVal:event.target.value
        })
    }

    componentDidMount() {
        this.setState({
            accountId:this.props.match.params.accountId,
            renameInputVal:this.getAccountNameFromId(this.props.match.params.accountId)
        })
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps)
        if(prevProps.match.params.accountId != this.props.match.params.accountId) {
            this.componentDidMount()
        }
    }

    onDeleteAccount(event) {
        event.preventDefault()
        this.props.cashApiClient.deleteAccount(this.state.accountId).then((res) => {
            this.props.onAccountUpdate()
            this.props.history.push("/")
        })
    }

    getAccountNameFromId(id) {
        return this.props.accountList.accounts.find((el) => el._id == id).name
    }

    render() {
        console.log("Component rendering")

        return (
            <div class="mainDashboard">
                <div class="card bg-dark my-card text-white mb-2 ">
                    <h1 className="display-6">{this.getAccountNameFromId(this.state.accountId)}</h1>
                </div>
                <form className="mb-5" onSubmit={this.onRenameFormSubmit} method="PUT">
                    <div className="mb-3">
                        <label for="renameInput" className="form-label">Nome account:</label>
                        <input type="text" className="form-control" id="renameInput" value={this.state.renameInputVal} onChange={this.onRenameInputChange}></input>
                    </div>
                    <button type="submit" class="btn btn-success text-white">Aggiorna</button>
                    <button onClick={this.onDeleteAccount} class="btn btn-danger text-white mx-2">Elimina conto</button>

                </form>
            </div>
        )
    }
}

export default withRouter(AccountInfo)