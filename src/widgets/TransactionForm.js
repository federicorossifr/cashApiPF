import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker  from "react-datepicker";

class NewTransactionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            amountInput:"",
            typeInput:"",
            descriptionInput:"",
            categoryInput:"",
            dateInput: new Date()
        }

        this.onDatePickerChange = this.onDatePickerChange.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.cashApiClient = this.props.cashApiClient
        this.onDescriptionBlur = this.onDescriptionBlur.bind(this)

    }

    onDatePickerChange(date) {
        this.setState({dateInput:date})
    }

    onInputChange(event) {
        switch (event.target.name) {
            case "amount":
                this.setState({amountInput:event.target.value})
                break;
            case "category":
                this.setState({categoryInput:event.target.value})
                break;
            case "description":
                this.setState({descriptionInput:event.target.value})
                break;
            case "type":
                this.setState({typeInput:event.target.value})
                break;
        }
    }

    onDescriptionBlur(event) {
        let value = event.target.value
        this.cashApiClient.getClassifiedDescription(value).then((res) => {
            if(res && res.length > 0)
                this.setState({categoryInput:res[0].category})
        })
    }

    onFormSubmit(event) {
        event.preventDefault();
        let transaction = {
            'date':this.state.dateInput,
            'description':this.state.descriptionInput,
            'amountIn': (this.state.amountInput > 0) ? parseInt(this.state.amountInput): null,
            'amountOut': (this.state.amountInput < 0) ? parseInt(this.state.amountInput): null,
            'type': this.state.typeInput,
            'category': this.state.categoryInput
        }
        this.props.addItemCallback(transaction)
    }

    renderCategoryDatalist() {
        return (
        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
            <input name="category" onChange={this.onInputChange} value={this.state.categoryInput} class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Categoria" aria-describedby="basic-addon1" />
            <datalist id="datalistOptions">
                {this.props.distinctCategories.map((cat) => <option value={cat} />)}
            </datalist>
        </div>
        )
    }

    render() {

        return (
            <form onSubmit={this.onFormSubmit}>
                <div className="container">
                    <div className="row mb-1">
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <div className="input-group">
                                <span class="input-group-text"><i class="bi bi-currency-euro"></i></span>
                                <input name="amount" value={this.state.amountInput} type="number" step="0.01" class="form-control" placeholder="Importo" onChange={this.onInputChange}></input>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <DatePicker  selected={this.state.dateInput} className="form-control" onChange={this.onDatePickerChange} />
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <input onBlur={this.onDescriptionBlur} name="description" value={this.state.descriptionInput} type="text" class="form-control" placeholder="Descrizione" onChange={this.onInputChange}></input>
                        </div>
                    </div>

                    <div className="row mb-1">
                        {this.renderCategoryDatalist()}
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <input name="type" value={this.state.typeInput} type="text" class="form-control" placeholder="Tipo" onChange={this.onInputChange}></input>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
                            <button type="submit" class="form-control btn btn-dark">Aggiungi</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default NewTransactionForm