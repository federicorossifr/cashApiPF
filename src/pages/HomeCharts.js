import { el } from 'date-fns/locale';
import React from 'react'
import { PolarArea, Bar } from 'react-chartjs-2';

const baseColors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
];

const accountColors = [
    "#94c973",
    "#2f5233",
    "#b1d8b7",
    "#76b947",
    "#08313a",
    "#5cd85a",
    "#107869",
    "#1a5653"
]

function getInitialData() {
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


class AccountAggregationChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data:getInitialData(),
            isLoaded:false
        }
        this.options = { maintainAspectRatio: false	}
        this.getElementAtEvent = this.getElementAtEvent.bind(this)
    }

    getElementAtEvent(element) {
        if(element.length == 0) return this.props.onAccountSelected()
        let datasetIdx = element[0].datasetIndex;
        let entryIdx = element[0].index;
        let clickedAccount = this.state.data.labels[entryIdx];
        let clickedAccountId = this.props.accountList.accounts.find((el) => el.name == clickedAccount)._id;
        this.props.onAccountSelected(clickedAccountId)
    }

    componentDidMount() {
        console.log("trigger")
        this.props.cashApiClient.getAggregatedAccounts().then(res => {
            let labels = res.map((el) => el.accountDetails[0].name)
            let values = res.map((el) => Number(el.net.toFixed(2)))
            let newData = this.state.data
            newData.labels = labels
            newData.datasets[0].data = values
            newData.datasets[0].backgroundColor = accountColors.slice(0,res.length)
            this.setState({data:newData,isLoaded:true})
        })
    }


    render() {
        return(
            <div style={{ width: '100%', height: 500 }}>
                {this.state.isLoaded && <PolarArea getElementAtEvent={this.getElementAtEvent} data={this.state.data} options={this.options} /> }
          </div>
        )
    }
}

class ExpenseAggregationChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data:[],
            isLoaded:false
        }
        this.options = { maintainAspectRatio: false, legend: { display: false}	}
    }

    componentDidMount() {
        this.props.cashApiClient.getAggregatedCategories(this.props.selectedAccountId).then(res => {
            let expenseCategories = res.filter((el) => el.totalOut < 0)
            let sortedExpenseCategories = expenseCategories.sort((a,b) => Math.abs(a.totalOut) < Math.abs(b.totalOut))
            let labels = sortedExpenseCategories.map((el) => el._id)
            let values = sortedExpenseCategories.map((el) => Math.abs(Number(el.totalOut.toFixed(2))))
            let newData = getInitialData()
            newData.labels = labels
            newData.datasets[0].label = "Spese"
            newData.datasets[0].data = values
            newData.datasets[0].backgroundColor = baseColors.slice(0,expenseCategories.length)
            this.setState({data:newData,isLoaded:true})
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedAccountId != this.props.selectedAccountId) {
            console.log("updating?")
            this.setState({data:[]})
            this.componentDidMount()
        }
    }


    render() {
        return(
            <div style={{ width: '100%', height: 500 }}>
                {this.state.isLoaded && <Bar  data={this.state.data} options={this.options} /> }
            </div>
        )
    }
}

class HomeCharts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedAccountId: null
        }
        this.onAccountSelected = this.onAccountSelected.bind(this)
    }

    onAccountSelected(id) {
        this.setState({selectedAccountId:id})
    }

    render() {
        return (
            <div className="chart-rows-container">
                <div className="row chart-row">
                        <div className="col-sm-6">
                        <div id="my-chart-0">
                            <AccountAggregationChart onAccountSelected={this.onAccountSelected} accountList={this.props.accountList} cashApiClient={this.props.cashApiClient} />
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div id="my-chart-1">
                            <ExpenseAggregationChart selectedAccountId={this.state.selectedAccountId} cashApiClient={this.props.cashApiClient}/>
                        </div>
                        </div>
                </div>
            </div>
        )
    }

}

export default HomeCharts