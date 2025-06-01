"use client";

import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Моковые данные для графиков
const tasksStats = {
  onTime: 75,
  late: 25,
};

const supervisorStats = [
  { name: "Петренко П.П.", onTime: 90, total: 20 },
  { name: "Сидоренко С.С.", onTime: 70, total: 15 },
  { name: "Новиченко Н.Н.", onTime: 60, total: 10 },
];

const yearStats = [
  { year: 2022, onTime: 80, late: 20 },
  { year: 2023, onTime: 70, late: 30 },
  { year: 2024, onTime: 75, late: 25 },
];

export default function HeadReports() {
  const t = useTranslations("head");

  const pieData = {
    labels: ["Вчасно", "З запізненням"],
    datasets: [
      {
        data: [tasksStats.onTime, tasksStats.late],
        backgroundColor: ["#22c55e", "#f59e42"],
        borderColor: ["#16a34a", "#ea580c"],
        borderWidth: 2,
        hoverOffset: 10,
        borderRadius: 8,
        spacing: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#334155",
          font: { size: 16, weight: "bold" },
          padding: 24,
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#18181b",
        bodyColor: "#18181b",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  const barData = {
    labels: supervisorStats.map((s) => s.name),
    datasets: [
      {
        label: "% завдань вчасно",
        data: supervisorStats.map((s) => s.onTime),
        backgroundColor: "#38bdf8",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#18181b",
        bodyColor: "#18181b",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 14 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "#e5e7eb" },
        title: {
          display: true,
          text: "% вчасно",
          color: "#334155",
          font: { size: 16 },
        },
        ticks: { color: "#64748b", font: { size: 14 } },
      },
    },
  };

  const yearBarData = {
    labels: yearStats.map((y) => y.year),
    datasets: [
      {
        label: "Вчасно",
        data: yearStats.map((y) => y.onTime),
        backgroundColor: "#22c55e",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      {
        label: "З запізненням",
        data: yearStats.map((y) => y.late),
        backgroundColor: "#f59e42",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  };

  const yearBarOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#334155", font: { size: 16 } },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#18181b",
        bodyColor: "#18181b",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 14 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "#e5e7eb" },
        title: {
          display: true,
          text: "%",
          color: "#334155",
          font: { size: 16 },
        },
        ticks: { color: "#64748b", font: { size: 14 } },
      },
    },
  };

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Звітність та аналітика</h1>
      <Card>
        <CardBody>
          <Tabs aria-label="Head Reports">
            <Tab key="tasks" title="Завдання вчасно">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="w-80 h-80 bg-white rounded-xl shadow-lg flex items-center justify-center p-6">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    % завдань, зданих вчасно
                  </h2>
                  <ul className="text-default-500">
                    <li>
                      Вчасно:{" "}
                      <span className="text-green-600 font-bold">
                        {tasksStats.onTime}%
                      </span>
                    </li>
                    <li>
                      З запізненням:{" "}
                      <span className="text-orange-500 font-bold">
                        {tasksStats.late}%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Tab>
            <Tab key="supervisors" title="Рейтинг керівників">
              <div className="w-full md:w-2/3 mx-auto bg-white rounded-xl shadow-lg p-6">
                <Bar data={barData} options={barOptions} />
                <h2 className="text-lg font-semibold mt-4 text-center">
                  Найкращі керівники за здачею завдань вчасно
                </h2>
              </div>
            </Tab>
            <Tab key="years" title="По роках">
              <div className="w-full md:w-2/3 mx-auto bg-white rounded-xl shadow-lg p-6">
                <Bar data={yearBarData} options={yearBarOptions} />
                <h2 className="text-lg font-semibold mt-4 text-center">
                  Динамика по роках
                </h2>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
