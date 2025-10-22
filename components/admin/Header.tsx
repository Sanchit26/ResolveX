import React, { useMemo } from 'react';
import { BellIcon, SearchIcon, UserCircleIcon } from './icons';
import CallMeButton from './CallMeButton';

interface HeaderProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
	const todayLabel = useMemo(
		() =>
			new Intl.DateTimeFormat('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			}).format(new Date()),
		[]
	);

	return (
		<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<p className="text-sm text-gray-500">{todayLabel}</p>
				<h1 className="mt-1 text-2xl font-semibold text-gray-900">Complaints Command Center</h1>
				<p className="text-sm text-gray-500">
					Track submissions, triage priorities, and keep customers in the loop in real time.
				</p>
			</div>
			<div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center">
				<div className="relative w-full md:w-80">
					<SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					<label htmlFor="complaint-search" className="sr-only">
						Search complaints
					</label>
					<input
						id="complaint-search"
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search by customer, tracking ID, or category"
						className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
					/>
				</div>
				<div className="flex items-center justify-between gap-3 md:justify-start">
					<CallMeButton className="hidden md:inline-flex" />
					<button
						type="button"
						className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
						aria-label="View notifications"
					>
						<BellIcon className="h-5 w-5" />
						<span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
							3
						</span>
					</button>
					<div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
						<UserCircleIcon className="h-9 w-9 text-gray-400" />
						<div className="leading-tight">
							<p className="text-sm font-semibold text-gray-900">Alexis Rivers</p>
							<p className="text-xs text-gray-500">Customer Operations Lead</p>
						</div>
					</div>
				</div>
			</div>
			{/* Mobile Call Me Button */}
			<div className="md:hidden">
				<CallMeButton className="w-full justify-center" />
			</div>
		</header>
	);
};

export default Header;