import React from 'react';
import { Complaint, ComplaintStatus } from './types';
import DashboardStats from './DashboardStats';
import ComplaintChart from './ComplaintChart';
import ComplaintTable from './ComplaintTable';

interface DashboardPageProps {
	complaints: Complaint[];
	filteredComplaints: Complaint[];
	activeFilter: ComplaintStatus | 'All';
	setActiveFilter: (filter: ComplaintStatus | 'All') => void;
	onSelectComplaint: (complaint: Complaint) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
	complaints,
	filteredComplaints,
	activeFilter,
	setActiveFilter,
	onSelectComplaint,
}) => {
	return (
		<>
			<DashboardStats
				complaints={complaints}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<div className="mt-8">
				<ComplaintChart complaints={complaints} />
			</div>
			<div className="mt-8">
				<ComplaintTable
					complaints={filteredComplaints}
					onSelectComplaint={onSelectComplaint}
				/>
			</div>
		</>
	);
};

export default DashboardPage;