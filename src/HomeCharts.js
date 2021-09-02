import React from 'react'
import ReactDOM from 'react-dom'
import CashApiClient from './cashAPIClient'
import { PieChart, Pie, ResponsiveContainer, LabelList  } from 'recharts';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

class HomeCharts extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data:[]
        }
        this.cashApiClient = new CashApiClient("/")
    }

    componentDidMount() {
        this.cashApiClient.getAggregatedAccounts().then(res => {
            this.setState({data:res})
        })
    }


    render() {
        return(
            <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="net" data={this.state.data} fill="#8884d8" label>
                    <LabelList dataKey="_id" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
    }
}


ReactDOM.render(
    <HomeCharts />,
    document.getElementById("my-chart-0")
)

