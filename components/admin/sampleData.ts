import { Complaint, ComplaintStatus } from './types';

export const SAMPLE_COMPLAINTS: Complaint[] = [
	{
		_id: 'sample-001',
		trackingId: 'CMP-001',
		description:
			'My package was supposed to arrive last week but the tracking status has not changed for several days. Please help me understand when it will arrive.',
		name: 'Alice Johnson',
		email: 'alice.johnson@example.com',
		department: 'Logistics',
		status: ComplaintStatus.Pending,
		category: 'Logistics',
		priority: 'High',
		dateFiled: '2024-01-08T10:00:00.000Z',
		updatedAt: '2024-01-08T10:00:00.000Z',
		history: [
			{
				timestamp: '2024-01-08T10:00:00.000Z',
				status: ComplaintStatus.Pending,
				notes: 'Complaint submitted by customer.',
				updatedBy: 'System',
			},
		],
	},
	{
		_id: 'sample-002',
		trackingId: 'CMP-002',
		description:
			'The headset I ordered arrived with a cracked ear cup. Looking for either a replacement or a refund as soon as possible.',
		name: 'Bob Williams',
		email: 'bob.williams@example.com',
		department: 'Product Support',
		status: ComplaintStatus.InProgress,
		category: 'Product Quality',
		priority: 'High',
		dateFiled: '2024-01-06T14:30:00.000Z',
		updatedAt: '2024-01-07T09:15:00.000Z',
		history: [
			{
				timestamp: '2024-01-06T14:30:00.000Z',
				status: ComplaintStatus.Pending,
				notes: 'Complaint submitted with photos attached.',
				updatedBy: 'System',
			},
			{
				timestamp: '2024-01-07T09:15:00.000Z',
				status: ComplaintStatus.InProgress,
				notes: 'Replacement order initiated, awaiting warehouse confirmation.',
				updatedBy: 'Admin User',
			},
		],
	},
	{
		_id: 'sample-003',
		trackingId: 'CMP-003',
		description:
			'My last invoice shows an extra $30 charge that I did not authorize. Please investigate and adjust the bill.',
		name: 'Carla Mendes',
		email: 'carla.mendes@example.com',
		department: 'Finance',
		status: ComplaintStatus.Resolved,
		category: 'Billing',
		priority: 'Medium',
		dateFiled: '2024-01-04T09:45:00.000Z',
		updatedAt: '2024-01-06T16:10:00.000Z',
		history: [
			{
				timestamp: '2024-01-04T09:45:00.000Z',
				status: ComplaintStatus.Pending,
				notes: 'Complaint submitted by customer.',
				updatedBy: 'System',
			},
			{
				timestamp: '2024-01-05T12:30:00.000Z',
				status: ComplaintStatus.InProgress,
				notes: 'Finance team verifying invoice items.',
				updatedBy: 'Finance Analyst',
			},
			{
				timestamp: '2024-01-06T16:10:00.000Z',
				status: ComplaintStatus.Resolved,
				notes: 'Charge corrected and customer notified of refund.',
				updatedBy: 'Finance Analyst',
			},
		],
	},
	{
		_id: 'sample-004',
		trackingId: 'CMP-004',
		description:
			'I get an unexpected error whenever I try to log into the self-service portal. I have already tried resetting my password.',
		name: 'Deepak Sharma',
		email: 'deepak.sharma@example.com',
		department: 'Customer Success',
		status: ComplaintStatus.InProgress,
		category: 'Technical Support',
		priority: 'High',
		dateFiled: '2024-01-03T08:10:00.000Z',
		updatedAt: '2024-01-03T10:00:00.000Z',
		history: [
			{
				timestamp: '2024-01-03T08:10:00.000Z',
				status: ComplaintStatus.Pending,
				notes: 'Complaint submitted by customer.',
				updatedBy: 'System',
			},
			{
				timestamp: '2024-01-03T10:00:00.000Z',
				status: ComplaintStatus.InProgress,
				notes: 'Support engineer assigned to investigate login service.',
				updatedBy: 'Support Bot',
			},
		],
	},
	{
		_id: 'sample-005',
		trackingId: 'CMP-005',
		description:
			'I was promised a refund last month but have not received anything yet. Can you confirm when it will be processed?',
		name: 'Emily Zhang',
		email: 'emily.zhang@example.com',
		department: 'Finance',
		status: ComplaintStatus.Rejected,
		category: 'Refunds',
		priority: 'Low',
		dateFiled: '2023-12-28T11:20:00.000Z',
		updatedAt: '2023-12-30T15:45:00.000Z',
		history: [
			{
				timestamp: '2023-12-28T11:20:00.000Z',
				status: ComplaintStatus.Pending,
				notes: 'Complaint submitted by customer.',
				updatedBy: 'System',
			},
			{
				timestamp: '2023-12-30T15:45:00.000Z',
				status: ComplaintStatus.Rejected,
				notes: 'Refund already processed; duplicate request closed.',
				updatedBy: 'Admin User',
			},
		],
	},
];
