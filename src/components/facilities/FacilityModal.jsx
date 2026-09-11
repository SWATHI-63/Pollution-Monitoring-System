import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFacilities } from '../../context/FacilityContext';
import { useToast } from '../../context/ToastContext';

export function FacilityModal({ isOpen, onClose, facility }) {
  const { addFacility, updateFacility } = useFacilities();
  const { addToast } = useToast();

  const isEditing = Boolean(facility);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    industryType: '',
    location: '',
    contactPerson: '',
    contactEmail: '',
    compliancePercentage: 95,
    status: 'NORMAL'
  });

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        code: facility.code || '',
        industryType: facility.industryType || '',
        location: facility.location || '',
        contactPerson: facility.contactPerson || '',
        contactEmail: facility.contactEmail || '',
        compliancePercentage: facility.compliancePercentage || 95,
        status: facility.status || 'NORMAL'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        industryType: '',
        location: '',
        contactPerson: '',
        contactEmail: '',
        compliancePercentage: 95,
        status: 'NORMAL'
      });
    }
  }, [facility, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateFacility(facility.id, formData);
      addToast({
        type: 'success',
        title: 'Facility Updated',
        message: `${formData.name} details have been updated.`
      });
    } else {
      addFacility(formData);
      addToast({
        type: 'success',
        title: 'Facility Added',
        message: `${formData.name} added to active environmental monitoring grid.`
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Facility – ${facility.name}` : 'Register New Industrial Facility'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Facility Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bio-Pharma Distillation Plant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Facility Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BP-05"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Industry Classification *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pharmaceuticals, Electroplating"
              value={formData.industryType}
              onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Location &amp; Zone *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sector 9, Heavy Engineering Belt"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Compliance Officer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rajesh Sharma"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="e.g. safety@plant.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
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
            {isEditing ? 'Save Changes' : 'Register Facility'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

