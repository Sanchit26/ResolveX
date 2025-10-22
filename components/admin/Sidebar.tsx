import React from 'react';
import { HomeIcon, ChartBarIcon, CogIcon, UserCircleIcon, UserGroupIcon } from './icons';

type Page = 'Dashboard' | 'Analytics' | 'Settings' | 'Admin';

interface SidebarProps {
	activePage: Page;
	setActivePage: (page: Page) => void;
}

const navItems: Array<{
	label: string;
	description: string;
	page: Page;
	icon: React.ComponentType<{ className?: string }>;
}> = [
	{
		label: 'Overview',
		description: 'Queue health and workload',
		page: 'Dashboard',
		icon: HomeIcon,
	},
	{
		label: 'Analytics',
		description: 'Trends and KPIs',
		page: 'Analytics',
		icon: ChartBarIcon,
	},
	{
		label: 'Workflow',
		description: 'Automation & escalation',
		page: 'Settings',
		icon: CogIcon,
	},
	{
		label: 'Team',
		description: 'Admin roster & access',
		page: 'Admin',
		icon: UserGroupIcon,
	},
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
	return (
		<aside className="hidden w-72 flex-shrink-0 border-r border-gray-200 bg-white px-5 py-8 lg:flex lg:flex-col lg:justify-between">
			<div className="space-y-8">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Complaint HQ</p>
					<h2 className="mt-2 text-xl font-bold text-gray-900">Operations Desk</h2>
					<p className="mt-1 text-sm text-gray-500">
						Resolve more complaints, faster. Switch views to manage workload, dig into analytics, and tune your team.
					</p>
				</div>
				<nav className="space-y-2">
					{navItems.map(({ label, description, page, icon: Icon }) => {
						const isActive = activePage === page;
						return (
							<button
								key={page}
								onClick={() => setActivePage(page)}
								className={`w-full rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
									isActive
										? 'border-blue-100 bg-blue-50 text-blue-900 shadow-sm'
										: 'border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
								}`}
							>
								<div className="flex items-start gap-3">
									<span
										className={`rounded-xl p-2 ${
											isActive ? 'bg-white text-blue-600 shadow-md' : 'bg-gray-100 text-gray-500'
										}`}
									>
										<Icon className="h-6 w-6" />
									</span>
									<div>
										<p className={`text-sm font-semibold ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>{label}</p>
										<p className="mt-1 text-xs text-gray-500">{description}</p>
									</div>
								</div>
							</button>
						);
					})}
				</nav>
			</div>
			<div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
				<div className="flex items-center gap-3">
					<span className="rounded-full bg-blue-100 p-3 text-blue-600">
						<UserCircleIcon className="h-6 w-6" />
					</span>
					<div>
						<p className="text-sm font-semibold text-gray-900">Alexis Rivers</p>
						<p className="text-xs text-gray-500">Customer Ops Lead</p>
					</div>
				</div>
				<p className="mt-4 text-xs text-gray-500">
					Need to onboard a new teammate? Visit the Team view to invite, update roles, or deactivate accounts.
				</p>
			</div>
		</aside>
	);
};

export default Sidebar;