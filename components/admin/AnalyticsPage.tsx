import React, { useMemo } from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus } from './types';
import { Doughnut, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { differenceInHours } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

interface AnalyticsPageProps {
	complaints: Complaint[];
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
		<h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
		<div className="relative h-80">{children}</div>
	</div>
);

const KpiCard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
	<div className="bg-white p-6 rounded-lg shadow-md">
		<p className="text-sm font-medium text-gray-500">{title}</p>
		<p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
		<p className="mt-1 text-sm text-gray-500">{description}</p>
	</div>
);

const doughnutOptions = {
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom' as const,
		},
	},
};

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ complaints }) => {
	const categoryData = useMemo(() => {
		const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
			acc[complaint.category] = (acc[complaint.category] || 0) + 1;
			return acc;
		}, {});

		return {
			labels: Object.keys(counts),
			datasets: [
				{
					label: 'Complaints by Category',
					data: Object.values(counts),
					backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6'],
					borderWidth: 1,
				},
			],
		};
	}, [complaints]);

	const priorityData = useMemo(() => {
		const counts: Record<ComplaintPriority, number> = {
			Critical: 0,
			High: 0,
			Medium: 0,
			Low: 0,
		};
		complaints.forEach((complaint) => {
			counts[complaint.priority] += 1;
		});

		return {
			labels: ['Critical', 'High', 'Medium', 'Low'],
			datasets: [
				{
					label: 'Complaints by Priority',
					data: [counts.Critical, counts.High, counts.Medium, counts.Low],
					backgroundColor: ['#991B1B', '#EF4444', '#F97316', '#14B8A6'],
					borderWidth: 1,
				},
			],
		};
	}, [complaints]);

	const statusData = useMemo(() => {
		const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
			acc[complaint.status] = (acc[complaint.status] || 0) + 1;
			return acc;
		}, {});

		return {
			labels: Object.keys(counts),
			datasets: [
				{
					label: 'Complaints by Status',
					data: Object.values(counts),
					backgroundColor: ['#FDE68A', '#3B82F6', '#34D399', '#FCA5A5'],
					borderWidth: 1,
				},
			],
		};
	}, [complaints]);

	const metrics = useMemo(() => {
		if (complaints.length === 0) {
			return {
				totalComplaints: 0,
				resolutionRate: 0,
				avgResolutionTime: 0,
				avgFirstResponseTime: 0,
			};
		}

		const safeDate = (value?: string) => {
			if (!value) {
				return null;
			}
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? null : date;
		};

		const diffHours = (start: Date | null, end: Date | null) => {
			if (!start || !end) {
				return 0;
			}
			return Math.max(differenceInHours(end, start), 0);
		};

		let resolvedCount = 0;
		let totalResolutionHours = 0;
		let respondedCount = 0;
		let totalFirstResponseHours = 0;

		complaints.forEach((complaint) => {
			const filedDate = safeDate(complaint.dateFiled);
			const updatedDate = safeDate(complaint.updatedAt);

			if (complaint.status === ComplaintStatus.Resolved) {
				resolvedCount += 1;
				totalResolutionHours += diffHours(filedDate, updatedDate);
			}

			const firstHistoryUpdate = (complaint.history ?? []).find(
				(entry) => entry.status !== ComplaintStatus.Pending,
			);

			if (firstHistoryUpdate) {
				respondedCount += 1;
				totalFirstResponseHours += diffHours(
					filedDate,
					safeDate(firstHistoryUpdate.timestamp),
				);
				return;
			}

			if (typeof complaint.responseTime === 'number') {
				respondedCount += 1;
				totalFirstResponseHours += Math.max(complaint.responseTime, 0);
				return;
			}

			if (complaint.status !== ComplaintStatus.Pending) {
				respondedCount += 1;
				totalFirstResponseHours += diffHours(filedDate, updatedDate);
			}
		});

		return {
			totalComplaints: complaints.length,
			resolutionRate: resolvedCount ? Math.round((resolvedCount / complaints.length) * 100) : 0,
			avgResolutionTime: resolvedCount ? totalResolutionHours / resolvedCount : 0,
			avgFirstResponseTime: respondedCount ? totalFirstResponseHours / respondedCount : 0,
		};
	}, [complaints]);

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KpiCard
					title="Total Complaints"
					value={metrics.totalComplaints.toString()}
					description="Complaints tracked in the last 60 days"
				/>
				<KpiCard
					title="Resolution Rate"
					value={`${metrics.resolutionRate}%`}
					description="Percentage resolved successfully"
				/>
				<KpiCard
					title="Avg Resolution Time"
					value={`${metrics.avgResolutionTime.toFixed(1)} hrs`}
					description="From submission to closure"
				/>
				<KpiCard
					title="Avg First Response"
					value={`${metrics.avgFirstResponseTime.toFixed(1)} hrs`}
					description="Time taken to send the first update"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Complaints by Category">
					<Doughnut data={categoryData} options={doughnutOptions} />
				</ChartCard>
				<ChartCard title="Complaints by Status">
					<Doughnut data={statusData} options={doughnutOptions} />
				</ChartCard>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Priority Distribution">
					<PolarArea data={priorityData} options={doughnutOptions} />
				</ChartCard>
				<div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center space-y-4">
					<h3 className="text-xl font-semibold text-gray-800">Operational Insights</h3>
					<ul className="space-y-2 text-sm text-gray-600">
						<li>• Critical and high priority cases total {priorityData.datasets[0].data[0] + priorityData.datasets[0].data[1]} tickets.</li>
						<li>• {metrics.resolutionRate}% resolution rate indicates overall team efficiency.</li>
						<li>
							• Average first response is {metrics.avgFirstResponseTime.toFixed(1)} hours — aim for under 6 hours
								for premium customers.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;