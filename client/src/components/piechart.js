import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';


class PieChart extends Component {

    constructor() {
      super();
      this.state = {
        labels: [
            "Food",
            "Retail",
            "Health and Education"
          ],
          datasets: [
            {
              data: [50, 30, 20],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }]
      };
    }
    setLabels(labels) {
        this.setState.labels = labels;
    }
    setData(data) {
        this.setState.data = data;
    }
    render() {
        return <Doughnut data={this.state} width={ 300} height={ 150} options={{ maintainAspectRatio: false }}/>
    }
}
export default PieChart;