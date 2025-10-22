import React, { useState } from 'react';
import { BellIcon, UserIcon } from './icons';

type PreferenceKey = 'emailAlerts' | 'smsAlerts' | 'weeklyDigest';

const SettingsPage: React.FC = () => {
	const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
		emailAlerts: true,
		smsAlerts: false,
		weeklyDigest: true,
	});
	const [signature, setSignature] = useState('Warm regards,\nAlexis Rivers\nCustomer Operations Lead');
	const [responseGoal, setResponseGoal] = useState(6);

	const togglePreference = (key: PreferenceKey) => {
		setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div className="space-y-8">
			<section>
				<h1 className="text-3xl font-bold text-gray-900">Workflow & Notifications</h1>
				<p className="mt-1 text-sm text-gray-500">
					Control how your team is notified and tailor auto-responses to match your support voice.
				</p>
			</section>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="space-y-6">
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-center gap-3">
							<span className="rounded-xl bg-blue-100 p-3 text-blue-600">
								<BellIcon className="h-6 w-6" />
							</span>
							<div>
								<h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
								<p className="text-sm text-gray-500">Choose which updates reach you instantly.</p>
							</div>
						</div>
						<ul className="mt-6 space-y-4 text-sm text-gray-600">
							<li className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-800">Email alerts</p>
									<p>New complaint assignments and escalations.</p>
								</div>
								<label className="relative inline-flex cursor-pointer items-center">
									<input
										type="checkbox"
										checked={preferences.emailAlerts}
										onChange={() => togglePreference('emailAlerts')}
										className="peer sr-only"
									/>
									<div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
								</label>
							</li>
							<li className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-800">SMS alerts</p>
									<p>Critical SLA breaches delivered to your phone.</p>
								</div>
								<label className="relative inline-flex cursor-pointer items-center">
									<input
										type="checkbox"
										checked={preferences.smsAlerts}
										onChange={() => togglePreference('smsAlerts')}
										className="peer sr-only"
									/>
									<div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
								</label>
							</li>
							<li className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-800">Weekly digest</p>
									<p>Snapshot of KPIs shipped every Monday morning.</p>
								</div>
								<label className="relative inline-flex cursor-pointer items-center">
									<input
										type="checkbox"
										checked={preferences.weeklyDigest}
										onChange={() => togglePreference('weeklyDigest')}
										className="peer sr-only"
									/>
									<div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
								</label>
							</li>
						</ul>
					</div>
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-center gap-3">
							<span className="rounded-xl bg-purple-100 p-3 text-purple-600">
								<UserIcon className="h-6 w-6" />
							</span>
							<div>
								<h2 className="text-lg font-semibold text-gray-900">Auto-response signature</h2>
								<p className="text-sm text-gray-500">Appears below outbound emails.</p>
							</div>
						</div>
						<textarea
							value={signature}
							onChange={(event) => setSignature(event.target.value)}
							rows={6}
							className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 shadow-inner focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
						/>
						<div className="mt-4 flex justify-end">
							<button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
								Save signature
							</button>
						</div>
					</div>
				</div>
				<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-gray-900">Service level targets</h2>
					<p className="mt-1 text-sm text-gray-500">
						Set expectations that power notifications and SLA dashboards.
					</p>
					<div className="mt-6 space-y-4 text-sm text-gray-600">
						<label className="block">
							<span className="text-gray-700">First response goal (hours)</span>
							<input
								type="number"
								min={1}
								max={48}
								value={responseGoal}
								onChange={(event) => setResponseGoal(Number(event.target.value))}
								className="mt-2 w-40 rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							/>
						</label>
						<div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-900">
							<p className="font-semibold">Heads up</p>
							<p className="mt-1">
								If a complaint stays pending longer than {responseGoal} hours, the team receives an instant alert and the
								escalation workflow kicks in.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;