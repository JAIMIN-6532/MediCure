import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import AnimatedTransition from "./AnimatedTransition";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Set default Chart.js options
ChartJS.defaults.font.family = "inherit";
ChartJS.defaults.color = "hsl(215 16% 47%)";
ChartJS.defaults.borderColor = "hsl(214 32% 91%)";

// Chart configurations
const chartConfigs = {
  line: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          backgroundColor: "hsl(0 0% 100%)",
          titleColor: "hsl(222 47% 11%)",
          bodyColor: "hsl(222 47% 11%)",
          borderColor: "hsl(214 32% 91%)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function (context) {
              return `Patients: ${context.parsed.y}`;
            },
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          type: "category",
          offset: true,
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            font: {
              size: 10,
            },
            callback: function (value, index) {
              return this.getLabelForValue(value).split(" ")[0];
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: true,
          grace: "15%",
          ticks: {
            precision: 0,
            callback: function (value) {
              return "₹" + value;
            },
          },
        },
      },
      elements: {
        line: {
          tension: 0.3,
        },
        point: {
          radius: 3,
          hoverRadius: 5,
        },
      },
    },
  },
  bar: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          backgroundColor: "hsl(0 0% 100%)",
          titleColor: "hsl(222 47% 11%)",
          bodyColor: "hsl(222 47% 11%)",
          borderColor: "hsl(214 32% 91%)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function (context) {
              return `Appointments: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
          },
          ticks: {
            precision: 0,
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    },
  },
  doughnut: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 11,
            },
          },
        },
        tooltip: {
          displayColors: false,
          backgroundColor: "hsl(0 0% 100%)",
          titleColor: "hsl(222 47% 11%)",
          bodyColor: "hsl(222 47% 11%)",
          borderColor: "hsl(214 32% 91%)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
    },
  },
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const IndividualStatChart = ({ doctorId }) => {
  const [statsData, setStatsData] = useState({
    weekly: { labels: [], values: [] },
    revenue: { labels: [], values: [] },
    types: { labels: ["Online", "Offline"], values: [0, 0] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weeklyRes, revenueRes, typesRes] = await Promise.all([
          axios.get(
            `${
              import.meta.env.VITE_APP_API_URL
            }/api/doctor/weekly-appointments/${doctorId}`
          ),
          axios.get(
            `${
              import.meta.env.VITE_APP_API_URL
            }/api/doctor/monthly-revenue/${doctorId}`
          ),
          axios.get(
            `${
              import.meta.env.VITE_APP_API_URL
            }/api/doctor/appointment-types/${doctorId}`
          ),
        ]);

        setStatsData({
          weekly: processWeeklyData(weeklyRes.data),
          revenue: processRevenueData(revenueRes.data),
          types: processTypesData(typesRes.data),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (doctorId) fetchData();
  }, [doctorId]);

  const processWeeklyData = (apiData) => ({
    labels: apiData.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    values: apiData.map((item) => item.count),
  });
  const processRevenueData = (apiData) => {
    // Get current month index (0-11)
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    // Filter out future months (only show up to current month)
    const filteredData = apiData.filter(
      (_, index) => index <= currentMonthIndex
    );

    return {
      labels: filteredData.map(
        (item) => `${MONTHS[item.month - 1]} ${item.year}`
      ),
      values: filteredData.map((item) => item.revenue),
    };
  };

  const processTypesData = (apiData) => ({
    labels: ["Online", "Offline"],
    values: [
      apiData.find((item) => item._id === "Online")?.count || 0,
      apiData.find((item) => item._id === "Offline")?.count || 0,
    ],
  });

  // Chart data configurations
  const weeklyAppointmentsData = {
    labels: statsData.weekly.labels,
    datasets: [
      {
        label: "Appointments",
        data: statsData.weekly.values,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const monthlyRevenueData = {
    labels: statsData.revenue.labels,
    datasets: [
      {
        label: "Revenue",
        data: statsData.revenue.values,
        fill: true,
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        borderColor: "rgba(74, 222, 128, 0.8)",
        pointBackgroundColor: "rgba(74, 222, 128, 1)",
      },
    ],
  };

  const appointmentTypesData = {
    labels: statsData.types.labels,
    datasets: [
      {
        data: statsData.types.values,
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* weekly appointments with y-axis */}
      <AnimatedTransition className="col-span-1 md:col-span-2">
        <div className="bg-background border border-border rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-4">Weekly Appointments</h3>
          <div className="h-64">
            <Bar
              data={weeklyAppointmentsData}
              options={{
                ...chartConfigs.bar.options,
                scales: {
                  ...chartConfigs.bar.options.scales,
                  y: {
                    ...chartConfigs.bar.options.scales.y,
                    suggestedMax:
                      Math.max(...statsData.weekly.values) * 1.2 || 10,
                    ticks: {
                      ...chartConfigs.bar.options.scales.y.ticks,
                      callback: (value) => (value % 1 === 0 ? value : ""),
                    },
                  },
                },
                plugins: {
                  ...chartConfigs.bar.options.plugins,
                  tooltip: {
                    ...chartConfigs.bar.options.plugins.tooltip,
                    callbacks: {
                      label: (context) => `Appointments: ${context.parsed.y}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </AnimatedTransition>

      {/* Appointment Types */}
      <AnimatedTransition delay={0.1}>
        <div className="bg-background border border-border rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-4">Appointment Types</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={appointmentTypesData}
              options={{
                ...chartConfigs.doughnut.options,
                plugins: {
                  ...chartConfigs.doughnut.options.plugins,
                  tooltip: {
                    ...chartConfigs.doughnut.options.plugins.tooltip,
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </AnimatedTransition>

      {/* Monthly Revenue */}
      <AnimatedTransition delay={0.2} className="col-span-1 md:col-span-3">
        <div className="bg-background border border-border rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-4">Monthly Revenue</h3>
          <div className="h-64 min-w-[800px]">
            <Line
              data={monthlyRevenueData}
              options={{
                ...chartConfigs.line.options,
                plugins: {
                  ...chartConfigs.line.options.plugins,
                  tooltip: {
                    ...chartConfigs.line.options.plugins.tooltip,
                    callbacks: {
                      label: (context) =>
                        `Revenue: ₹${context.parsed.y.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default IndividualStatChart;
