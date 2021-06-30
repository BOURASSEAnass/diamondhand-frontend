import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'chartjs-adapter-date-fns';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
  Tooltip,
  InteractionMode,
  FontSpec,
} from 'chart.js';
import enUS from 'date-fns/locale/en-US';
import { useTheme } from 'styled-components';
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
  Tooltip,
);

export interface PriceChartProps {
  isSmall?: boolean;
  data: [number, string][];
}

export const PriceChart: React.FC<PriceChartProps> = ({ isSmall, data }) => {
  const theme = useTheme();
  const chartRef = useRef<HTMLCanvasElement>();
  const [diamondPriceChart, setDiamondPriceChart] = useState<Chart | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionDefault = useMemo<any>(() => {
    if (!theme) return null;
    return {
      aspectRatio: 2,
      interaction: {
        mode: 'index' as InteractionMode,
        intersect: false,
      },
      stacked: false,
      scales: {
        xAxis: {
          type: 'time',
          display: true,
          startAngle: 10,
          grid: {
            display: false,
          },
          ticks: {
            color: theme.color.primary.main,
            padding: 10,
            font: {
              size: 14,
              style: 'normal',
              weight: '500',
              family: 'Chakra Petch',
            } as FontSpec,
            maxTicksLimit: 10,
            maxRotation: 0,
            minRotation: 0,
          },
          adapters: {
            date: {
              locale: enUS,
            },
          },
        },
        yAxis: {
          display: true,
          grid: {
            color: theme.color.grey[200],
            lineWidth: 0.75,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            color: theme.color.primary.main,
            padding: 20,
            font: {
              size: 14,
              style: 'normal',
              weight: '500',
              family: 'Chakra Petch',
            } as FontSpec,
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: theme.color.blue[400],
          titleColor: theme.color.primary.main,
          titleAlign: 'center',
          titleFont: {
            style: 'normal',
            size: 12,
          } as FontSpec,
          bodyColor: theme.color.primary.main,
          bodyAlign: 'center',
          bodyFont: {
            size: 14,
            style: 'normal',
            weight: '600',
          } as FontSpec,
          borderColor: theme.color.primary.main,
          borderWidth: 2,
          cornerRadius: 0,
          padding: 12,
          displayColors: false,
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: function (context: any) {
              return `Price: ${context.parsed.y}`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          pointStyle: 'line',
        },
      },
    };
  }, [theme]);

  const optionSmall = useMemo(() => {
    return {
      aspectRatio: 5,
      scales: {
        xAxis: {
          type: 'time',
          display: false,
          adapters: {
            date: {
              locale: enUS,
            },
          },
        },
        yAxis: {
          display: false,
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          pointStyle: 'line',
          radius: 0,
        },
      },
    };
  }, []);

  useEffect(() => {
    if (!data || !diamondPriceChart) return;
    const chartData = data.map((t) => {
      return {
        x: t[0] * 1000,
        y: parseFloat(t[1]),
      };
    });
    if (!diamondPriceChart.data.datasets[0]) return;
    diamondPriceChart.data.datasets[0].data = chartData;
    diamondPriceChart.update();
  }, [data, diamondPriceChart]);

  useEffect(() => {
    if (!chartRef?.current || !theme) return;
    const priceChart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        datasets: [
          {
            type: 'line',
            data: [],
            borderColor: theme.color.orange[300],
            borderWidth: isSmall ? 2 : 4,
            fill: false,
          },
        ],
      },
      options: isSmall ? optionSmall : optionDefault,
    });
    setDiamondPriceChart(priceChart);
    return function cleanup() {
      priceChart?.destroy();
    };
  }, [chartRef, theme, optionDefault, optionSmall, isSmall]);

  return (
    <>
      <canvas ref={chartRef}></canvas>
    </>
  );
};
