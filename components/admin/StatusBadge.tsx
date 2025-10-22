import React from 'react';
import { ComplaintStatus } from './types';

interface StatusBadgeProps {
	status: ComplaintStatus;
}

const STATUS_STYLES: Record<ComplaintStatus, string> = {
	[ComplaintStatus.Pending]: 'bg-yellow-100 text-yellow-800',
	[ComplaintStatus.InProgress]: 'bg-blue-100 text-blue-800',
	[ComplaintStatus.Resolved]: 'bg-green-100 text-green-800',
	[ComplaintStatus.Rejected]: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	return (
		<span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${STATUS_STYLES[status]}`}>
			{status}
		</span>
	);
};

export default StatusBadge;