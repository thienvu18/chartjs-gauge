var randomValue = function (data) {
  return Math.max.apply(null, data) * Math.random();
};

var data = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6];
var value = randomValue(data);

var config = {
  type: 'gauge',
  data: {
    datasets: [{
      data: data,
      minValue: data[0],
      value: value,
      backgroundColor: [
        '#00C853',
        '#00C853',
        '#00C853',

        '#64DD17',
        '#64DD17',
        '#64DD17',

        '#AEEA00',
        '#AEEA00',

        '#FFEB3B',
        '#FFEB3B',
        '#FFEB3B',

        '#FF9800',
        '#FF9800',
        '#FF9800',

        '#F44336',
        '#F44336',
        '#F44336',
        '#F44336',
      ],
      borderWidth: 0,
    }]
  },
  options: {
    aspectRatio: 2,
    circumference: 270,
    rotation: 135,
    cutout: '65%',
    responsive: true,
    title: {
      display: true,
      text: 'Gauge chart'
    },
    needle: {
      // Needle circle radius as the percentage of the chart area width
      radiusPercentage: 1,
      // Needle width as the percentage of the chart area width
      widthPercentage: 2,
      // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
      lengthPercentage: 80,
      // The color of the needle
      color: 'rgba(0, 0, 0, 1)'
    },
    valueLabel: {
      formatter: (chart) => function (value) { return Math.round(value * 1000) / 10 },
      display: true,
      backgroundColor: '#fff',
      color: '#000',
      fontSize: 28,
      bottomMarginPercentage: -12,
    }
  }
};

window.onload = function () {
  var ctx = document.getElementById('chart');
  window.myGauge = new Chart(ctx, config);
};

document.getElementById('randomizeData').addEventListener('click', function () {
  config.data.datasets.forEach(function (dataset) {
    dataset.value = randomValue(dataset.data);
  });

  window.myGauge.update();
});