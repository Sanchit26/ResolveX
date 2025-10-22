import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Complaint, ComplaintHistoryEntry, ComplaintStatus } from './types';
import { subDays, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ComplaintChartProps {
	complaints: Complaint[];
}

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'top' as const,
			title: {
				display: false,
			},
		},
		tooltip: {
			mode: 'index' as const,
			intersect: false,
		},
	},
	scales: {
		y: {
			beginAtZero: true,
			grid: {
				color: '#E5E7EB',
			},
			ticks: {
				stepSize: 1,
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
};

const ComplaintChart: React.FC<ComplaintChartProps> = ({ complaints }) => {
	const chartData = useMemo(() => {
		const labels: string[] = [];
		const newComplaintsData: number[] = [];
		const resolvedComplaintsData: number[] = [];

		const safeDate = (value?: string) => {
			if (!value) {
				return null;
			}
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? null : date;
		};

		for (let i = 6; i >= 0; i -= 1) {
			const date = subDays(new Date(), i);
			labels.push(format(date, 'MMM d'));

			const interval = { start: startOfDay(date), end: endOfDay(date) };

			const newToday = complaints.filter((complaint: Complaint) => {
				const filedDate = safeDate(complaint.dateFiled);
				return filedDate ? isWithinInterval(filedDate, interval) : false;
			}).length;

			const resolvedToday = complaints.filter((complaint: Complaint) => {
				const historyResolved = (complaint.history ?? []).some((entry: ComplaintHistoryEntry) => {
					if (entry.status !== ComplaintStatus.Resolved) {
						return false;
					}
					const entryDate = safeDate(entry.timestamp);
					return entryDate ? isWithinInterval(entryDate, interval) : false;
				});

				if (historyResolved) {
					return true;
				}

				if (complaint.status !== ComplaintStatus.Resolved) {
					return false;
				}

				const updatedDate = safeDate(complaint.updatedAt);
				return updatedDate ? isWithinInterval(updatedDate, interval) : false;
			}).length;

			newComplaintsData.push(newToday);
			resolvedComplaintsData.push(resolvedToday);
		}

		return {
			labels,
			datasets: [
				{
					label: 'New Complaints',
					data: newComplaintsData,
					borderColor: '#3B82F6',
					backgroundColor: 'rgba(59, 130, 246, 0.2)',
					tension: 0.4,
					fill: true,
					pointRadius: 4,
					pointBackgroundColor: '#3B82F6',
				},
				{
					label: 'Resolved Complaints',
					data: resolvedComplaintsData,
					borderColor: '#10B981',
					backgroundColor: 'rgba(16, 185, 129, 0.2)',
					tension: 0.4,
					fill: true,
					pointRadius: 4,
					pointBackgroundColor: '#10B981',
				},
			],
		};
	}, [complaints]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md h-96">
			<h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Trend</h3>
			<Line data={chartData} options={chartOptions} />
		</div>
	);
};

export default ComplaintChart;