import React, { useMemo, useState } from 'react';
import { Complaint, ComplaintStatus } from './types';
import StatusBadge from './StatusBadge';
import { XIcon } from './icons';
import { format } from 'date-fns';

interface ComplaintDetailsModalProps {
	complaint: Complaint;
	onClose: () => void;
	onUpdateStatus: (
		complaintId: string,
		trackingId: string,
		newStatus: ComplaintStatus,
		notes: string,
	) => void;
}

const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({ complaint, onClose, onUpdateStatus }) => {
	const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
	const [notes, setNotes] = useState('');

	const sortedHistory = useMemo(() => {
		const history = complaint.history ?? [];
		return [...history].sort(
			(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
		);
	}, [complaint.history]);

	const handleUpdate = () => {
		if (!notes.trim()) {
			return;
		}
		onUpdateStatus(complaint._id, complaint.trackingId, newStatus, notes.trim());
		setNotes('');
		onClose();
	};

	const filedOnLabel = complaint.dateFiled ? format(new Date(complaint.dateFiled), 'MMM d, yyyy · h:mm a') : 'Not available';
	const updatedOnLabel = complaint.updatedAt ? format(new Date(complaint.updatedAt), 'MMM d, yyyy · h:mm a') : filedOnLabel;
	const headerTitle = complaint.category || 'Complaint details';

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="p-6 border-b border-slate-200 flex justify-between items-start">
					<div>
						<h2 className="text-2xl font-semibold text-slate-900">{headerTitle}</h2>
						<p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
							<span>Tracking ID: {complaint.trackingId}</span>
							<span>•</span>
							<span>Department: {complaint.department}</span>
							<span>•</span>
							<span>Priority: {complaint.priority}</span>
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
					>
						<XIcon className="h-6 w-6" />
					</button>
				</div>
				<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
					<div className="lg:col-span-2 space-y-6">
						<section>
							<h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
							<p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
								{complaint.description || 'No description provided.'}
							</p>
						</section>
						<section>
							<h3 className="text-lg font-semibold text-slate-800 mb-3">Status History</h3>
							{sortedHistory.length > 0 ? (
								<ul className="space-y-4 border-l-2 border-slate-200 ml-2">
									{sortedHistory.map((entry, index) => (
										<li key={`${entry.timestamp}-${index}`} className="relative pl-6">
											<div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-blue-400 ring-4 ring-white"></div>
											<p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												Status set to <StatusBadge status={entry.status} />
											</p>
											<p className="text-xs text-slate-500">
												{format(new Date(entry.timestamp), 'MMM d, yyyy · h:mm a')} by {entry.updatedBy || 'System'}
											</p>
											{entry.notes && (
												<p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded-md border border-slate-200">
													{entry.notes}
												</p>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-slate-500">No status updates have been recorded yet.</p>
							)}
						</section>
					</div>
					<div className="space-y-6">
						<section className="bg-slate-50 rounded-lg p-5 border border-slate-200">
							<h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Details</h3>
							<dl className="space-y-2 text-sm text-slate-600">
								<div>
									<dt className="font-medium text-slate-700">Name</dt>
									<dd>{complaint.name || 'Unknown citizen'}</dd>
								</div>
								<div>
									<dt className="font-medium text-slate-700">Email</dt>
									<dd>{complaint.email || 'Not provided'}</dd>
								</div>
								<div>
									<dt className="font-medium text-slate-700">Department</dt>
									<dd>{complaint.department}</dd>
								</div>
								<div>
									<dt className="font-medium text-slate-700">Priority</dt>
									<dd className="capitalize">{complaint.priority.toLowerCase()}</dd>
								</div>
								<div>
									<dt className="font-medium text-slate-700">Filed on</dt>
									<dd>{filedOnLabel}</dd>
								</div>
								<div>
									<dt className="font-medium text-slate-700">Last updated</dt>
									<dd>{updatedOnLabel}</dd>
								</div>
							</dl>
						</section>
						<section className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
							<h3 className="text-lg font-semibold text-slate-800">Update Status</h3>
							<label className="block text-sm font-medium text-slate-700">New status</label>
							<select
								value={newStatus}
								onChange={(event) => setNewStatus(event.target.value as ComplaintStatus)}
								className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
							>
								<option value={ComplaintStatus.Pending}>Pending</option>
								<option value={ComplaintStatus.InProgress}>In Progress</option>
								<option value={ComplaintStatus.Resolved}>Resolved</option>
								<option value={ComplaintStatus.Rejected}>Rejected</option>
							</select>

							<label className="block text-sm font-medium text-slate-700">Notes</label>
							<textarea
								value={notes}
								onChange={(event) => setNotes(event.target.value)}
								rows={4}
								className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
								placeholder="Add a short note about this update"
							/>

							<div className="flex justify-end gap-3">
								<button
									onClick={onClose}
									className="px-4 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
								>
									Cancel
								</button>
								<button
									onClick={handleUpdate}
									disabled={!notes.trim()}
									className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
								>
									Update Complaint
								</button>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComplaintDetailsModal;