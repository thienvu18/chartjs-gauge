/*!
 * @license
 * chartjs-chart-gauge
 * https://github.com/thienvu18/chartjs-gauge
 * Version: 0.4.0
 *
 * Copyright 2025 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/thienvu18/chartjs-gauge/blob/master/LICENSE.md
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chart));
})(this, (function (chart_js) { 'use strict';

class GaugeController extends chart_js.DoughnutController {
  static id = 'gauge';

  static defaults = {
    ...GaugeController.defaults,
    aspectRatio: 2,
    needle: {
      radiusPercentage: 2,
      widthPercentage: 3.2,
      lengthPercentage: 80,
      color: 'rgba(0, 0, 0, 1)',
    },
    valueLabel: {
      display: true,
      formatter: null,
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderRadius: 5,
      padding: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      },
      bottomMarginPercentage: 5,
    },
    animation: {
      duration: 1000,
      animateRotate: true,
      animateScale: false,
    },
    cutout: '50%', // changed from cutoutPercentage
    rotation: -Math.PI,
    circumference: Math.PI
  };

  static overrides = {
    ...GaugeController.overrides,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  update(mode) {
    const dataset = this.getDataset();
    dataset.minValue = dataset.minValue || 0;

    const meta = this._cachedMeta;
    const initialValue = {valuePercent: 0};

    if (mode === 'reset') {
      meta.previous = null;
      meta.current = initialValue;
    } else {
      dataset.data.sort((a, b) => a - b);
      meta.previous = meta.current || initialValue;
      meta.current = {
        valuePercent: this.getValuePercent(dataset, dataset.value),
      };
    }

    super.update(mode);
  }

  draw() {
    super.draw();
    this.drawNeedle();
    this.drawValueLabel();
    this.drawPieLegend();
  }

  updateElements(arcs, start, count, mode) {
    const reset = mode === 'reset';
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : this.innerRadius;
    const outerRadius = animateScale ? 0 : this.outerRadius;
    const {sharedOptions, includeOptions} = this._getSharedOptions(start, mode);

    const dataset = this.getDataset();
    const {data} = dataset;

    for (let index = start; index < start + count; ++index) {
      const arc = arcs[index];

      const previousValue = index === 0 ? dataset.minValue : data[index - 1];
      const value = data[index];
      const startAngle = this.getAngle(this.chart, this.getValuePercent(dataset, previousValue)) * (Math.PI / 180);
      const endAngle = this.getAngle(this.chart, this.getValuePercent(dataset, value)) * (Math.PI / 180);
      const circumference = endAngle - startAngle;
      const properties = {
        x: centerX + this.offsetX,
        y: centerY + this.offsetY,
        startAngle,
        endAngle,
        circumference,
        outerRadius,
        innerRadius
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(index, arc.active ? 'active' : mode);
      }

      this.updateElement(arc, index, properties, mode);
    }
  }

  getValuePercent({minValue, data}, value) {
    const min = minValue || 0;
    const max = data[data.length - 1] || 1;
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }

    return (value - min) / (max - min);
  }

  getWidth() {
    const {chartArea} = this.chart;
    return chartArea.right - chartArea.left;
  }

  getTranslation() {
    const {chartArea} = this.chart;
    return {
      dx: (chartArea.left + chartArea.right) / 2 + this.offsetX,
      dy: (chartArea.top + chartArea.bottom) / 2 + this.offsetY,
    };
  }

  getAngle(chart, valuePercent) {
    const {rotation, circumference} = chart.options;
    return rotation + (circumference * valuePercent);
  }

  drawNeedle() {
    const {_ctx: ctx, chart, innerRadius, outerRadius} = this;
    const dataset = this.getDataset();
    const {needle} = chart.options;
    const {radiusPercentage, widthPercentage, lengthPercentage, color} = needle;
    const width = this.getWidth();
    const needleRadius = (radiusPercentage / 100) * width;
    const needleWidth = (widthPercentage / 100) * width;
    const needleLength = (lengthPercentage / 100) * (outerRadius - innerRadius) + innerRadius;
    const {dx, dy} = this.getTranslation();
    const meta = this._cachedMeta;
    const origin = this.getAngle(chart, meta.previous?.valuePercent || 0);
    const target = this.getAngle(chart, this.getValuePercent(dataset, dataset.value));
    const angle = origin + (target - origin); // no animation easing here for simplicity

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = color;

    // Draw circle base
    ctx.beginPath();
    ctx.ellipse(0, 0, needleRadius, needleRadius, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw needle
    ctx.beginPath();
    ctx.moveTo(0, needleWidth / 2);
    ctx.lineTo(needleLength, 0);
    ctx.lineTo(0, -needleWidth / 2);
    ctx.fill();
    ctx.restore();
  }

  drawValueLabel() {
    const {_ctx: ctx, chart} = this;
    const dataset = this.getDataset();
    const {valueLabel} = chart.options;

    if (!valueLabel?.display) {
      return;
    }

    const {
      formatter,
      fontSize = 14,
      color = '#fff',
      backgroundColor = '#000',
      borderRadius = 4,
      padding = {top: 4, bottom: 4, left: 6, right: 6},
      bottomMarginPercentage = 5
    } = valueLabel;

    const width = this.getWidth();
    const bottomMargin = (bottomMarginPercentage / 100) * width;
    const valueText = (formatter || (v => v))(dataset.value).toString();

    ctx.save();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(valueText).width;
    const textHeight = Math.max(ctx.measureText('M').width, fontSize); // Approximation

    const {dx, dy} = this.getTranslation();
    const angle = chart.options.rotation + Math.PI / 2;
    const tx = dx + bottomMargin * Math.cos(angle);
    const ty = dy + bottomMargin * Math.sin(angle);

    const x = -textWidth / 2 - padding.left;
    const y = -textHeight / 2 - padding.top;
    const w = textWidth + padding.left + padding.right;
    const h = textHeight + padding.top + padding.bottom;

    ctx.translate(tx, ty);

    // Background
    ctx.beginPath();
    this.roundedRect(ctx, x, y, w, h, borderRadius);
    ctx.fillStyle = backgroundColor;
    ctx.fill();

    // Text
    ctx.fillStyle = color;
    ctx.fillText(valueText, 0, 0);
    ctx.restore();
  }

  drawPieLegend() {
    const ctx = this.chart.ctx;
    const meta = this.getMeta();
    const dataset = this.getDataset();
    const arcs = meta.data;
    const legendRadius = arcs[0].innerRadius - 10;

    ctx.save();
    ctx.font = 'light 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    arcs.forEach((arc, index) => {
      if (index === 0 || index === arcs.length - 1 || index % 2 === 0) {
        const angle = arc.endAngle;
        const x = arc.x + legendRadius * Math.cos(angle);
        const y = arc.y + legendRadius * Math.sin(angle);

        const value = dataset.data[index];

        ctx.fillStyle = '#000';
        ctx.fillText(value, x, y);
      }
    });

    ctx.restore();
  }

  roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

chart_js.Chart.register(GaugeController, chart_js.ArcElement);

}));
