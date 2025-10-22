import React from 'react';
import { Complaint, ComplaintStatus } from './types';
import { DocumentReportIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface DashboardStatsProps {
	complaints: Complaint[];
	activeFilter: ComplaintStatus | 'All';
	setActiveFilter: (filter: ComplaintStatus | 'All') => void;
}

type CardDefinition = {
	label: string;
	value: number;
	icon: React.ReactNode;
	filter: ComplaintStatus | 'All';
	accent: string;
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ complaints, activeFilter, setActiveFilter }) => {
	const counts = {
		total: complaints.length,
		pending: complaints.filter((complaint) => complaint.status === ComplaintStatus.Pending).length,
		inProgress: complaints.filter((complaint) => complaint.status === ComplaintStatus.InProgress).length,
		resolved: complaints.filter((complaint) => complaint.status === ComplaintStatus.Resolved).length,
		rejected: complaints.filter((complaint) => complaint.status === ComplaintStatus.Rejected).length,
	};

	const cards: CardDefinition[] = [
		{
			label: 'Total',
			value: counts.total,
			icon: <DocumentReportIcon className="h-8 w-8" />,
			filter: 'All',
			accent: 'bg-gray-900 text-white',
		},
		{
			label: 'Pending',
			value: counts.pending,
			icon: <ClockIcon className="h-8 w-8" />,
			filter: ComplaintStatus.Pending,
			accent: 'bg-yellow-500 text-white',
		},
		{
			label: 'In Progress',
			value: counts.inProgress,
			icon: <ClockIcon className="h-8 w-8" />,
			filter: ComplaintStatus.InProgress,
			accent: 'bg-blue-500 text-white',
		},
		{
			label: 'Resolved',
			value: counts.resolved,
			icon: <CheckCircleIcon className="h-8 w-8" />,
			filter: ComplaintStatus.Resolved,
			accent: 'bg-green-500 text-white',
		},
		{
			label: 'Rejected',
			value: counts.rejected,
			icon: <XCircleIcon className="h-8 w-8" />,
			filter: ComplaintStatus.Rejected,
			accent: 'bg-red-500 text-white',
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
			{cards.map(({ label, value, icon, filter, accent }) => {
				const isActive = activeFilter === filter;
				return (
					<button
						key={label}
						onClick={() => setActiveFilter(filter)}
						className={`text-left rounded-xl shadow-sm px-5 py-4 transition-transform transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
							isActive ? accent : 'bg-white text-gray-700'
						}`}
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium opacity-80">{label}</p>
								<p className="mt-2 text-3xl font-bold">{value}</p>
							</div>
							<span className={`p-2 rounded-lg ${isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 text-gray-600'}`}>
								{icon}
							</span>
						</div>
					</button>
				);
			})}
		</div>
	);
};

export default DashboardStats;