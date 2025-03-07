import React from 'react';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IndividualStatChart = ({
  title,
  value,
  icon,
  chartColor,
  borderColor,
  change,
  chartType, // "bar", "doughnut", "pie", "line", or "combinedbar"
}) => {
  let ChartComponent;
  let data;
  let options;

  if (chartType.toLowerCase() === 'line') {
    ChartComponent = Line;
    data = {
      labels: ['Start', 'Now'],
      datasets: [
        {
          label: title,
          data: [0, value],
          fill: true,
          // Create a dynamic vertical gradient
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, chartColor);
            gradient.addColorStop(1, borderColor);
            return gradient;
          },
          borderColor: borderColor,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: borderColor,
        },
      ],
    };
    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: { y: { beginAtZero: true } },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  } else if (chartType.toLowerCase() === 'bar') {
    ChartComponent = Bar;
    data = {
      labels: [title],
      datasets: [
        {
          label: title,
          data: [value],
          backgroundColor: chartColor,
          borderColor: borderColor,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  } else if (chartType.toLowerCase() === 'pie') {
    ChartComponent = Pie;
    const dummyMax = 100000;
    data = {
      labels: [title, 'Remaining'],
      datasets: [
        {
          data: [value, dummyMax - value],
          backgroundColor: [chartColor, '#F3F4F6'],
          borderColor: [borderColor, '#F3F4F6'],
          borderWidth: 2,
        },
      ],
    };
    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  } else if (chartType.toLowerCase() === 'doughnut') {
    ChartComponent = Doughnut;
    const dummyMax = 200;
    data = {
      labels: [title, 'Remaining'],
      datasets: [
        {
          data: [value, dummyMax - value],
          backgroundColor: [chartColor, '#E5E7EB'],
          borderColor: [borderColor, '#E5E7EB'],
          borderWidth: 2,
        },
      ],
    };
    options = {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  } else if (chartType.toLowerCase() === 'combinedbar') {
    // Combined bar chart: expects value as { total, today }
    ChartComponent = Bar;
    data = {
      labels: ['Total Appointments', 'Appointments Today'],
      datasets: [
        {
          label: 'Appointments',
          data: [value.total, value.today],
          backgroundColor: [
            chartColor, // for Total Appointments
            'rgba(16, 185, 129, 0.5)', // for Appointments Today
          ],
          borderColor: [
            borderColor,
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  } else {
    // Fallback to bar chart if chartType is invalid
    ChartComponent = Bar;
    data = {
      labels: [title],
      datasets: [
        {
          label: title,
          data: [value],
          backgroundColor: chartColor,
          borderColor: borderColor,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#333333',
          bodyColor: '#333333',
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      animation: { duration: 1500, easing: 'easeOutQuart' },
    };
  }

  return (
    <div
      className="p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      style={{ height: '40vh' }}  // Adjust the height here; use '40vh' or '50vh' as desired.
    >
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{icon}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div style={{ height: 'calc(100% - 3rem)' }}> 
        {/* Subtract header height if needed */}
        <ChartComponent data={data} options={options} />
      </div>
      {change && <p className="mt-2 text-green-500 text-sm">{change}</p>}
    </div>
  );
};

export default IndividualStatChart;
