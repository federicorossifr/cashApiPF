import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns'
import format from 'date-fns/format';

class ItemList extends React.Component {

    constructor(props) {
        super(props)
    }

    formatDate(dateString) {
        let parsed = parseISO(dateString)
        let formatted = format(parsed,"dd.MM.yyyy")
        return formatted;
    }

    renderGuessTooltip(guessed) {
        if(guessed)
            return (<i data-bs-toggle="tooltip" data-bs-placement="top" title="La categoria &egrave; stata classificata automaticamente. Cambiala se ti sembra errata" className="bi bi-patch-question"></i>)
        else
            return (<i class="bi bi-check-circle"></i>)

    }

    getDistinctCategories(transactions) {
        let distCat = new Set()
        transactions.forEach((el) => {
            distCat.add(el.category)
        })
        return Array.from(distCat)
    }



    renderDatalistCategory(transaction,distCategories,index) {
        return (
            <div className="input-group">
                <span class="input-group-text" id="basic-addon1">{this.renderGuessTooltip(transaction.guessed)}</span>
                <input onBlur={(e) => {this.props.onDataListChange(e,index)}} defaultValue={transaction.category} class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." aria-describedby="basic-addon1" />
                <datalist id="datalistOptions">
                    {distCategories.map((cat) => <option value={cat} />)}
                </datalist>
            </div>
        )
    }

    renderCategory(transaction,distCategories,index) {
        if(this.props.listRole == "importer") 
            return this.renderDatalistCategory(transaction,distCategories,index)
        else
            return transaction.category
    }

    renderItems() {
        let distinctCategories = this.getDistinctCategories(this.props.elements)
        const items = this.props.elements.map((element,index) => 
            <tr key={index}>
                <td>{this.formatDate(element.date)}</td>
                <td className={element.amountIn ? "moneyIn":"moneyOut"}>{element.amountIn ? element.amountIn:element.amountOut}€</td>
                <td>{element.type}</td>
                <td>{this.renderCategory(element,distinctCategories,index)}</td>
                <td>{element.description}</td>
            </tr>
        )
        return items
    }

    componentDidMount() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }

    render() {
        return (
            <table className=" table table-striped table-hover">
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

export default ItemList