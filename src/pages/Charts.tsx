import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Charts = () => {
    const options = {
        title: {
            text: '',

        },
        xAxis: {
            title: {
                text: 'time',
            },
            categories: [], // No data
        },
        yAxis: {
            title: {
                text: 'Mbps',
            },
        },
        series: [
            {
                type: 'spline', // Changed to 'spline' for a curved line
                name: 'Value',
                data: [40, 50, 20, 10, 10, 20, 30, 40], // No data
            },
        ],
        credits: {
            enabled: false,
        }
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Charts;
