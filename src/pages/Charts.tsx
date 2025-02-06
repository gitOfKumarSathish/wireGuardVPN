import { AgCharts } from 'ag-charts-community';

const Charts = () => {
    const options = {
        autoSize: true,
        data: [], // No data
        title: {
            text: 'Line Chart Example',
        },
        series: [
            {
                type: 'line',
                xKey: 'year',
                yKey: 'value',
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: {
                    text: 'Year',
                },
            },
            {
                type: 'number',
                position: 'left',
                title: {
                    text: 'Value',
                },
            },
        ],
    };

    return <AgCharts options={options} />;
};

export default Charts;