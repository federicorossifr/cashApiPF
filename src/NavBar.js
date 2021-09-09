import React from "react";
import NewAccountForm from "./widgets/AccountNavigation";
import { NavLink, Link, Route, Switch } from "react-router-dom";



class Navbar extends React.Component {

    constructor(props) {
        super(props)
    }

    renderAccountList(accountList) {
        let entries = accountList.accounts.map( (account) => { 
            return(
            <li key={account._id} className="nav-item d-flex">
                <NavLink  to={"/accounts/" + account._id} className="nav-link text-white flex-grow-1" >
                    <i className="bi bi-wallet"></i>  {account.name}
                </NavLink>
                <NavLink to={"/accounts/" + account._id+"/settings"} className="nav-link text-white" >
                    <i class="bi bi-sliders"></i>
                </NavLink>
            </li>)
        })
        return entries;
    }

    getNavClassName() {
        if(this.props.shouldNavShowFull)
            return "position-absolute w-100 h-100 p-3 text-white bg-dark"
        else
            return "d-md-flex d-sm-none d-none flex-column flex-shrink-0 p-3 text-white bg-dark"
    }

    render() {
        return (
            <div id="navbar" style={{zIndex:99}} className={this.getNavClassName()} >
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 fs-4 mt-lg-1 mt-md-5 mt-sm-5 mt-xs-5 mt-5">CashAPI</span>
                </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <NavLink  exact={true} to="/" className="nav-link text-white" aria-current="page">
                        <i className="bi bi-bank"></i>  Home
                    </NavLink>
                </li>
                <hr />
                {this.renderAccountList(this.props.accountList)}
                <NewAccountForm cashApiClient={this.props.cashApiClient} onNewAccountSubmitted={this.props.onNewAccountSubmitted}/>
                <hr />

                <li>
                    <NavLink  to="/import" className="nav-link text-white">
                        <i className="bi bi-cloud-arrow-up"></i>  Importa
                    </NavLink>
                </li>
            </ul>
            </div>
        )
    }
}

export default Navbar