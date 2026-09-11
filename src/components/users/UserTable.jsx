import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, UserCheck, UserX, Search } from 'lucide-react';
import { INITIAL_USERS } from '../../data/initialUsers';
import { storage } from '../../utils/storage';
import { UserModal } from './UserModal';
import { StatusBadge } from '../common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export function UserTable() {
  const [users, setUsers] = useState(() => {
    return storage.get('system_users', INITIAL_USERS);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { addToast } = useToast();

  const persistUsers = (newUsers) => {
    setUsers(newUsers);
    storage.set('system_users', newUsers);
  };

  const handleSaveUser = (userObj) => {
    if (selectedUser) {
      persistUsers(users.map((u) => (u.id === userObj.id ? userObj : u)));
    } else {
      persistUsers([userObj, ...users]);
    }
  };

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      persistUsers(users.filter((u) => u.id !== userId));
      addToast({
        type: 'info',
        title: 'User Deleted',
        message: `${userName} removed from system registry.`
      });
    }
  };

  const handleToggleStatus = (userId) => {
    persistUsers(
      users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          addToast({
            type: nextStatus === 'ACTIVE' ? 'success' : 'warning',
            title: `Account ${nextStatus}`,
            message: `${u.name} is now ${nextStatus.toLowerCase()}.`
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search users by name, email, role, or division..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Employee / User
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">System Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {u.name ? u.name[0] : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {u.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={u.status === 'ACTIVE' ? 'COMPLIANT' : 'NORMAL'}
                      size="sm"
                      className={u.status !== 'ACTIVE' ? 'bg-slate-800 text-slate-400' : ''}
                    />
                    <span className="ml-1.5 text-[11px] font-semibold text-slate-400">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {u.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                    >
                      {u.status === 'ACTIVE' ? (
                        <UserX className="w-4 h-4 text-amber-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

