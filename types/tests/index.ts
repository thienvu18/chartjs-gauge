import {Chart} from 'chart.js';

// eslint-disable-next-line no-unused-vars
const chart = new Chart('id', {
  type: 'gauge',
  data: {
    datasets: [
      {
        value: 0.5,
        minValue: 0,
        data: [1, 2, 3, 4],
        backgroundColor: ['green', 'yellow', 'orange', 'red'],
      },
    ],
  },
  options: {
    needle: {
      radiusPercentage: 2,
      widthPercentage: 3.2,
      lengthPercentage: 80,
      color: 'rgba(0, 0, 0, 1)',
    },
    valueLabel: {
      display: true,
      formatter: (value) => {
        return '$' + Math.round(value);
      },
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderRadius: 5,
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  },
});
