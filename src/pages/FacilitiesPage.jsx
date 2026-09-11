import React, { useState } from 'react';
import { Building2, Plus, Filter, Search, ShieldCheck } from 'lucide-react';
import { useFacilities } from '../context/FacilityContext';
import { useAuth } from '../context/AuthContext';
import { FacilityCard } from '../components/facilities/FacilityCard';
import { FacilityModal } from '../components/facilities/FacilityModal';
import { useToast } from '../context/ToastContext';

export function FacilitiesPage() {
  const { facilities, selectedFacilityId, setSelectedFacilityId, deleteFacility } = useFacilities();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const handleEdit = (fac) => {
    setEditingFacility(fac);
    setModalOpen(true);
  };

  const handleDelete = (facId) => {
    const target = facilities.find((f) => f.id === facId);
    if (window.confirm(`Are you sure you want to remove "${target?.name}" from monitored facilities?`)) {
      deleteFacility(facId);
      addToast({
        type: 'info',
        title: 'Facility Removed',
        message: `${target?.name} was deleted from configuration.`
      });
    }
  };

  const filtered = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.industryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Plant Infrastructure
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {facilities.length} Monitored Industrial Units
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Facility Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Register, configure, and maintain industrial complexes under environmental surveillance.'
              : 'View monitored plant profiles and environmental conformity statuses.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingFacility(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industrial Facility</span>
          </button>
        )}
      </div>

      {/* Search & Selection Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search facilities by name, code, sector, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setSelectedFacilityId('ALL')}
          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
            selectedFacilityId === 'ALL'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          View All Monitored
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            isSelected={selectedFacilityId === facility.id}
            onSelect={(id) => setSelectedFacilityId(id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Facility Modal for Add/Edit */}
      {modalOpen && (
        <FacilityModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingFacility(null);
          }}
          facility={editingFacility}
        />
      )}
    </div>
  );
}

