import React from 'react'

class Summary extends React.Component {

    computeSummary() {
        if(this.props.elements.length < 1) return {'in':0,'out':0}
        let incomes = this.props.elements.map((el) => (el.amountIn? el.amountIn:0))
        let outcomes = this.props.elements.map((el) => (el.amountOut? el.amountOut:0))
        let totIn = incomes.reduce((acc,el)=>acc+el);
        let totOut = outcomes.reduce((acc,el)=>acc+el);
        return {
            'in':Number(totIn.toFixed(2)),
            'out':Number(totOut.toFixed(2)),
            'net':Number((totIn+totOut).toFixed(2))
        }
    }

    render() {
        let summary = this.computeSummary()
        return (
            <div class="card bg-dark my-card text-white ">
                <h1 className="display-4">Saldo: {summary.net}<i class="bi bi-currency-euro"></i></h1>
                <p className="lead">
                    <label style={{color:"green"}}><i class="bi bi-plus-circle-fill"></i></label> {summary.in}<i class="bi bi-currency-euro"></i><br></br> 
                    <label style={{color:"red"}}><i class="bi bi-dash-circle-fill"></i></label> {Math.abs(summary.out)}<i class="bi bi-currency-euro"></i>
                </p>
            </div>
        )
    }
}

export default Summary