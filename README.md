# ![chartjs-gauge logo](./logo.svg) chartjs-gauge (Chart.js v4+)

A simple, customizable **gauge chart** for [Chart.js](https://www.chartjs.org/), now compatible with **Chart.js v4+**.

> 🎉 **This is a fork of the original [`chartjs-gauge`](https://github.com/haiiaaa/chartjs-gauge)** with updated support for Chart.js v4.  
> If you're using Chart.js v2, please refer to the [original package](https://github.com/haiiaaa/chartjs-gauge).

---

## 🧪 Live Demos

- [Basic Gauge Chart](https://codepen.io/haiiaaa/pen/rNVbmYy)  
- [With Datalabels Plugin](https://codepen.io/haiiaaa/pen/KKpYmRz)  
- [Custom Labels](https://codepen.io/haiiaaa/pen/qBdwmyY)

---

## 📦 Installation

Using **npm**:

```bash
npm install chart.js chartjs-gauge
```

Or using **yarn**:

```bash
yarn add chart.js chartjs-gauge
```

---

## ⚙️ Configuration Options

The gauge chart extends the [doughnut chart](https://www.chartjs.org/docs/latest/charts/doughnut.html#dataset-properties) with custom options:

### `needle` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `needle.radiusPercentage` | `number` | `2` | Circle radius (%) of chart area width |
| `needle.widthPercentage`  | `number` | `3.2` | Needle width (%) of chart area width |
| `needle.lengthPercentage` | `number` | `80` | Needle length (%) between inner and outer arc radius |
| `needle.color`            | `string` | `'rgba(0, 0, 0, 1)'` | Needle color |

### `valueLabel` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `display` | `boolean` | `true` | Show the value label |
| `formatter` | `function` | `Math.round` | Custom format function |
| `fontSize` | `number` | `undefined` | Font size |
| `color` | `string` | `'rgba(255, 255, 255, 1)'` | Text color |
| `backgroundColor` | `string` | `'rgba(0, 0, 0, 1)'` | Background color |
| `borderRadius` | `number` | `5` | Border radius |
| `padding` | `object` | `{ top: 5, right: 5, bottom: 5, left: 5 }` | Padding |
| `bottomMarginPercentage` | `number` | `5` | Margin from bottom (% of chart width) |

---

## 🔧 Global Defaults

To apply default settings to all gauge charts:

```js
Chart.defaults.gauge.needle.radiusPercentage = 5;
```

These only affect charts **created after** the change.

---

## 📊 Dataset Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value`    | `number` | _required_ | The value to display (needle position) |
| `minValue` | `number` | `0`         | Minimum value of the gauge |
| `data`     | `number[]` | _required_ | Values for segments (used for gauge ranges) |
| `backgroundColor` | `string[]` | _required_ | Colors for each segment |

---

## 🧩 Example

```js
import { Chart, registerables } from 'chart.js';
import 'chartjs-gauge';

// You may need to register components manually in Chart.js v4
Chart.register(...registerables);

const ctx = document.getElementById('canvas').getContext('2d');

const chart = new Chart(ctx, {
  type: 'gauge',
  data: {
    datasets: [{
      value: 0.5,
      minValue: 0,
      data: [1, 2, 3, 4],
      backgroundColor: ['green', 'yellow', 'orange', 'red'],
    }]
  },
  options: {
    needle: {
      radiusPercentage: 2,
      widthPercentage: 3.2,
      lengthPercentage: 80,
      color: 'rgba(0, 0, 0, 1)'
    },
    valueLabel: {
      display: true,
      formatter: (value) => '$' + Math.round(value),
      color: 'white',
      backgroundColor: 'black',
      borderRadius: 5,
      padding: { top: 10, bottom: 10 }
    }
  }
});
```

---

## 📄 License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
