'use client';

import { useEffect, useState } from 'react';
import { TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAPI } from '@/lib/api';

export function UserManagement() {
	const [users, setUsers] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState('');
	const [formData, setFormData] = useState({ email: '', password: '', role: 'agency' });

	const loadUsers = async () => {
		try {
			const data = await fetchAPI('/admin/users');
			setUsers(data.users || []);
		} catch (error) {
			console.error('Failed to load users:', error);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const handleCreateUser = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setStatusMessage('');

		try {
			await fetchAPI('/auth/register', {
				method: 'POST',
				body: JSON.stringify(formData),
			});
			setShowForm(false);
			setFormData({ email: '', password: '', role: 'agency' });
			setStatusMessage('User created successfully.');
			loadUsers();
		} catch (error) {
			setStatusMessage('Failed to create user.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">User Management</h2>
					<p className="mt-1 text-sm text-slate-500">Create and manage authenticated users and role permissions.</p>
				</div>

				<button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
					<UserPlusIcon className="h-5 w-5" />
					Add User
				</button>
			</div>

			<AnimatePresence>
				{showForm ? (
					<motion.form initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} onSubmit={handleCreateUser} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<input type="email" placeholder="Email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
							<input type="password" placeholder="Password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
							<select value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
								<option value="agency">Agency</option>
								<option value="ngo">NGO</option>
								<option value="admin">Admin</option>
							</select>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
								{loading ? 'Creating...' : 'Create User'}
							</button>
							<button type="button" onClick={() => setShowForm(false)} disabled={loading} className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
								Cancel
							</button>
						</div>
					</motion.form>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{statusMessage ? (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mt-4 rounded-xl p-4 text-sm font-medium ${statusMessage.includes('Failed') ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
						{statusMessage}
					</motion.div>
				) : null}
			</AnimatePresence>

			<div className="mt-6 overflow-x-auto">
				<table className="w-full min-w-[760px]">
					<thead className="bg-slate-50">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Created</th>
							<th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200">
						{users.map((user) => (
							<tr key={user.id} className="transition hover:bg-slate-50/70">
								<td className="px-4 py-3 text-sm font-medium text-slate-900">{user.email}</td>
								<td className="px-4 py-3">
									<span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">{user.role}</span>
								</td>
								<td className="px-4 py-3 text-sm text-slate-600">{new Date(user.created_at).toLocaleDateString()}</td>
								<td className="px-4 py-3 text-right">
									<button className="text-red-600 transition hover:text-red-800">
										<TrashIcon className="h-5 w-5" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
