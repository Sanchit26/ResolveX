import React from 'react';
import { UserCircleIcon } from './icons';

const AdminPage: React.FC = () => {
    const handleLogout = () => {
        alert('You have been logged out.');
    };
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
                <p className="text-gray-600 mt-1">View administrator details and perform actions.</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Administrator Profile</h3>
                    </div>
                    <div className="p-5 flex items-center space-x-4">
                        <UserCircleIcon className="h-20 w-20 text-gray-300" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg font-semibold text-gray-800">Admin User</p>
                            <p className="mt-2 text-sm text-gray-500">Email Address</p>
                            <p className="text-lg font-semibold text-gray-800">admin@example.com</p>
                             <p className="mt-2 text-sm text-gray-500">Role</p>
                            <p className="text-lg font-semibold text-gray-800">Administrator</p>
                        </div>
                    </div>
                </div>
                 <div className="bg-white rounded-lg shadow-md p-5">
                    <h3 className="text-lg font-semibold text-gray-800">Account Actions</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                        Logging out will end your current session. You will need to sign in again to access the dashboard.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
