import React from 'react';
import { Complaint } from './types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

interface ComplaintTableProps {
	complaints: Complaint[];
	onSelectComplaint: (complaint: Complaint) => void;
}

const getInitials = (name: string) => {
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '??';
};

const formatDate = (value?: string) => {
	if (!value) {
		return '—';
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return '—';
	}

	return format(parsed, 'MMM d, yyyy');
};

const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints, onSelectComplaint }) => {
	return (
		<div className="bg-white shadow-md rounded-lg overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">Complaint Inbox</h2>
					<p className="text-sm text-gray-500">Select a complaint to review details and update the status.</p>
				</div>
				<span className="text-sm text-gray-500">{complaints.length} results</span>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Citizen
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Tracking ID
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Department
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Category
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Filed
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Priority
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{complaints.map((complaint) => (
							<tr
								key={complaint._id || complaint.trackingId}
								onClick={() => onSelectComplaint(complaint)}
								className="hover:bg-gray-50 cursor-pointer transition-colors"
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
											{getInitials(complaint.name)}
										</span>
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">{complaint.name}</div>
											<div className="text-sm text-gray-500">{complaint.email || 'Not provided'}</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">
									{complaint.trackingId}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
									{complaint.department}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
									{complaint.category}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<StatusBadge status={complaint.status} />
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(complaint.dateFiled)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium capitalize">
									{complaint.priority.toLowerCase()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{complaints.length === 0 && (
				<div className="text-center py-10 text-sm text-gray-500">No complaints match the current filters.</div>
			)}
		</div>
	);
};

export default ComplaintTable;