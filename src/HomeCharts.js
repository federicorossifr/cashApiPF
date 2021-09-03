import React from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'
import { PolarArea, Bar } from 'react-chartjs-2';

const baseColors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
];

const baseOptions = {
    maintainAspectRatio: false	// Don't maintain w/h ratio
}

let baseData = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  };




class AccountAggregationChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data:{...baseData},
            isLoaded:false
        }
        this.cashApiClient = new CashApiClient("/")
    }

    componentDidMount() {
        this.cashApiClient.getAggregatedAccounts().then(res => {
            let labels = res.map((el) => el.accountDetails[0].name)
            let values = res.map((el) => Number(el.net.toFixed(2)))
            let newData = this.state.data
            newData.labels = labels
            newData.datasets[0].data = values
            newData.datasets[0].backgroundColor = baseColors.slice(0,res.length)
            this.setState({data:newData,isLoaded:true})
        })
    }


    render() {
        return(
            <div style={{ width: '100%', height: 500 }}>
                {this.state.isLoaded && <PolarArea  data={this.state.data} options={baseOptions} /> }
          </div>
        )
    }
}

class ExpenseAggregationChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data:this.getInitialData(),
            isLoaded:false
        }
        this.cashApiClient = new CashApiClient("/")
        this.options = { maintainAspectRatio: false, legend: { display: false}	}

    }

    getInitialData() {
        return {
            labels: [],
            datasets: [
              {
                label: '',
                data: [],
                backgroundColor: [],
                borderWidth: 1,
              },
            ],
          };
    }

    componentDidMount() {
        this.cashApiClient.getAggregatedCategories().then(res => {
            let expenseCategories = res.filter((el) => el.totalOut < 0)

            let labels = expenseCategories.map((el) => el._id)
            let values = expenseCategories.map((el) => Math.abs(Number(el.totalOut.toFixed(2))))
            let newData = this.state.data
            newData.labels = labels
            newData.datasets[0].label = "Spese"
            newData.datasets[0].data = values
            newData.datasets[0].backgroundColor = baseColors.slice(0,expenseCategories.length)
            this.setState({data:newData,isLoaded:true})
        })
    }


    render() {
        return(
            <div style={{ width: '100%', height: 500 }}>
                {this.state.isLoaded && <Bar  data={this.state.data} options={this.options} /> }
          </div>
        )
    }
}


ReactDOM.render(
    <AccountAggregationChart />,
    document.getElementById("my-chart-0")
)

ReactDOM.render(
    <ExpenseAggregationChart />,
    document.getElementById("my-chart-1")
)


