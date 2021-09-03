import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns'
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

export default ItemList