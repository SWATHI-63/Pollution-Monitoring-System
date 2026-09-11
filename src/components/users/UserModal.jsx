import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export function UserModal({ isOpen, onClose, user, onSave }) {
  const { addToast } = useToast();
  const isEditing = Boolean(user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    department: 'Environmental Safety',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'EMPLOYEE',
        department: user.department || 'Operations',
        status: user.status || 'ACTIVE'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'EMPLOYEE',
        department: 'Operations',
        status: 'ACTIVE'
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please provide a valid email address (e.g. employee@company.com).'
      });
      return;
    }

    onSave({
      ...formData,
      email: formData.email.trim().toLowerCase(),
      id: user?.id || `usr-${Date.now()}`,
      createdAt: user?.createdAt || new Date().toISOString().split('T')[0]
    });

    addToast({
      type: 'success',
      title: isEditing ? 'User Updated' : 'User Created',
      message: `${formData.name} (${formData.role}) saved successfully.`
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit User – ${user.name}` : 'Create New System User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Priyadarshini Sundaram"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Email Address * (Any valid email format accepted)
          </label>
          <input
            type="email"
            required
            placeholder="e.g. any_user@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            No domain restrictions applied. Any standard email syntax is valid.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              System Role * (Strictly 2 Roles)
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="EMPLOYEE">EMPLOYEE (Monitoring Only)</option>
              <option value="ADMIN">ADMIN (Full Authority)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Account Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Department / Division
          </label>
          <input
            type="text"
            placeholder="e.g. Wastewater & Effluent Testing"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
          >
            {isEditing ? 'Save User' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

