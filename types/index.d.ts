import {
  DoughnutControllerChartOptions,
  DoughnutControllerDatasetOptions,
  Color,
} from 'chart.js';


declare module 'chart.js' {
    interface NeedleOptions {
        radiusPercentage: number;
        widthPercentage: number;
        lengthPercentage: number;
        color: Color;
    }

    interface PaddingValueLabelOptions {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    interface ValueLabelOptions {
        display: boolean;
        // eslint-disable-next-line no-unused-vars
        formatter(value: number): string;
        fontSize: number;
        color: Color;
        backgroundColor: Color;
        borderRadius: number;
        padding: PaddingValueLabelOptions;
        bottomMarginPercentage: number;
    }

    type GaugeControllerChartOptions = DoughnutControllerChartOptions & {
        needle: NeedleOptions;
        valueLabel: ValueLabelOptions;
    };

    type GaugeControllerDatasetOptions = DoughnutControllerDatasetOptions & {
        value: number;
        minValue: number;
    };

    // eslint-disable-next-line no-unused-vars
    interface ChartTypeRegistry {
        gauge: {
            chartOptions: GaugeControllerChartOptions;
            datasetOptions: GaugeControllerDatasetOptions;
        };
    }
}
