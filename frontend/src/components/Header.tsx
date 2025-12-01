import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, users, setUser } = useUser();

    // Don't show on Quiz page to avoid distraction? Or maybe show it.
    // Let's show it everywhere for now.

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                Math Practice
            </Link>

            <div className="flex items-center gap-4">
                <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                    View Profile
                </Link>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <User size={16} className="text-gray-500" />
                    <select
                        value={user?.id || ''}
                        onChange={(e) => {
                            const selected = users.find(u => u.id === parseInt(e.target.value));
                            if (selected) setUser(selected);
                        }}
                        className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
