//Not used anywhere .... 

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { subDays, format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AppointmentChart = ({ doctor }) => {
  const [chartData, setChartData] = useState({
    appointments: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const did = doctor._id;
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/doctor/weekly-stats/${did}`);
        setChartData(response.data);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setChartData({
          appointments: [65, 59, 80, 81, 56, 55, 40]
        });
      }
    };

    fetchData();
  }, [doctor]);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      fullDate: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      display: format(date, 'MMM dd')
    };
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const date = parseISO(last7Days[context[0].dataIndex].fullDate);
            return format(date, 'MMMM dd, yyyy');
          },
          label: (context) => `Total Appointments: ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => Number.isInteger(value) ? value : null,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const data = {
    labels: last7Days.map(day => day.display),
    datasets: [
      {
        label: 'Total Appointments',
        data: chartData.appointments,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ],
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default AppointmentChart;
