'use client';

import { useState } from 'react';
import { updateUserRole } from './actions';

type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
};

export default function AdminUserManager({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers);

    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } else {
            alert(result.error);
        }
    };

    return (
        <section className="admin-section user-manager" style={{ marginTop: '3rem' }}>
            <h2>Admin Management</h2>
            <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>Promote or demote users to manage who has access to this dashboard.</p>
            
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="USER">User (Customer)</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
                .user-manager {
                    background: rgba(30, 41, 59, 0.5);
                    padding: 2rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .table-responsive {
                    overflow-x: auto;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: #f8fafc;
                }
                .admin-table th, .admin-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .admin-table th {
                    font-weight: 600;
                    color: #cbd5e1;
                    background: rgba(15, 23, 42, 0.4);
                }
                .role-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .role-badge.user {
                    background: rgba(148, 163, 184, 0.2);
                    color: #cbd5e1;
                }
                .role-badge.admin {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }
                .role-select {
                    background: rgba(15, 23, 42, 0.8);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 0.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .role-select:focus {
                    outline: none;
                    border-color: #6366f1;
                }
            `}</style>
        </section>
    );
}
