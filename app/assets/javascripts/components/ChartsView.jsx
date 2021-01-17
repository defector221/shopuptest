import React, { Component } from 'react';
import Loader from './Loader';
import HighChartsWrapper from './HighChartsWrapper';
import Highcharts from 'highcharts';

export default class ChartsView extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading : true,
            data: null
        }
    }
    componentDidMount(){
        var self = this;
        $.ajax({
            url:'/api/lobby/stats/all',
            method:'POST',
            data:null,
            success: function(responseObj){
                if(responseObj.status){
                    self.setState({
                        data:responseObj.result,
                        isLoading: false
                    });
                } 
            },
            error: function(){
                alert('internal Server Error');
            }
        });
    }
    getChartOptions(){
        var chartData = this.state.data;
        return ({
            chart: {
                type: 'column'
            },
            title: {
                text: 'House Cuts Vs Lottery Price Money'
            },
            xAxis: {
                title: {
                    text: 'Stats  by Ticket ID'
                },
                categories: chartData.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Worth Prize Money'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}$<br/>Total: {point.stackTotal}$'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'House Cuts',
                data: [...chartData.cuts]
            }, {
                name: 'Prize',
                data: [...chartData.prize]
            }]
        });
    }
    render() {
        var {isLoading} = this.state;
        return (
            <React.Fragment>
                {isLoading ? 
                    <Loader />  : 
                    (<React.Fragment>
                        <HighChartsWrapper
                            highcharts={Highcharts}
                            constructorType={'chart'}
                            options={this.getChartOptions()}
                        />
                    </React.Fragment>)
                }
            </React.Fragment>
        )
    }
}
