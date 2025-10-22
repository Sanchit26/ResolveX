
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPageRedirect() {
	const router = useRouter();

	useEffect(() => {
		router.replace('/admin/dashboard');
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="text-center">
				<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p className="text-sm text-gray-600">Loading the admin workspace…</p>
			</div>
		</div>
	);
}



