import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Copy,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  ChevronRight
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const PREDEFINED_SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00'
];

export default function TutorSchedule() {
  const { user, profile, updateLocalProfile } = useAuth();
  
  // Selected day tab state
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Availability schedule dictionary state: { Monday: [...slots], Tuesday: [...] }
  const [schedule, setSchedule] = useState({});

  // Custom slot time input
  const [customSlot, setCustomSlot] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize schedule dictionary state from existing profile availability
  useEffect(() => {
    const initialSchedule = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    if (profile?.availability) {
      profile.availability.forEach((av) => {
        if (DAYS_OF_WEEK.includes(av.day)) {
          initialSchedule[av.day] = [...av.slots];
        }
      });
    }

    setSchedule(initialSchedule);
  }, [profile]);

  // Toggle predefined slot for the active day
  const handleToggleSlot = (slot) => {
    setSchedule((prev) => {
      const currentDaySlots = prev[selectedDay] || [];
      let updatedSlots;
      
      if (currentDaySlots.includes(slot)) {
        updatedSlots = currentDaySlots.filter((s) => s !== slot);
      } else {
        // Keep them sorted
        updatedSlots = [...currentDaySlots, slot].sort();
      }

      return {
        ...prev,
        [selectedDay]: updatedSlots
      };
    });
    setSuccessMessage('');
  };

  // Add custom slot time
  const handleAddCustomSlot = (e) => {
    e.preventDefault();
    if (!customSlot.trim()) return;

    // Simple time regex to assist with HH:MM-HH:MM standard format
    const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeFormatRegex.test(customSlot.trim())) {
      setErrorMessage('Time slot must match format HH:MM-HH:MM (e.g. 09:30-11:30)');
      return;
    }

    const slotVal = customSlot.trim();
    setSchedule((prev) => {
      const currentDaySlots = prev[selectedDay] || [];
      if (currentDaySlots.includes(slotVal)) {
        setErrorMessage('This time slot already exists for today');
        return prev;
      }
      return {
        ...prev,
        [selectedDay]: [...currentDaySlots, slotVal].sort()
      };
    });

    setCustomSlot('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Delete specific slot from day list
  const handleDeleteSlot = (slotToDelete) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter((s) => s !== slotToDelete)
    }));
    setSuccessMessage('');
  };

  // Clear all slots for active day
  const handleClearDay = () => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: []
    }));
    setSuccessMessage('');
  };

  // Copy active day slots to all other days
  const handleCopyToAllDays = () => {
    const activeSlots = schedule[selectedDay] || [];
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      DAYS_OF_WEEK.forEach((day) => {
        newSchedule[day] = [...activeSlots];
      });
      return newSchedule;
    });
    setSuccessMessage(`Copied ${selectedDay}'s slots to all other days! Click Save to apply.`);
  };

  // Save the full schedule to the database profile
  const handleSaveSchedule = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Transform dictionary to availability array payload
    // We only send days that have one or more slots configured
    const availabilityArray = Object.keys(schedule)
      .map((day) => ({
        day,
        slots: schedule[day]
      }))
      .filter((item) => item.slots.length > 0);

    try {
      const response = await profileAPI.updateTutorProfile({
        availability: availabilityArray
      });

      if (response.success) {
        updateLocalProfile(response.profileDetails);
        setSuccessMessage('Availability schedule updated successfully!');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(response.message || 'Failed to save availability schedule');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server error updating availability schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Availability Scheduler</h1>
          <p className="text-sm text-slate-600">Configure availability slot parameters used during recommendations calculations.</p>
        </div>
        <button
          onClick={handleSaveSchedule}
          disabled={loading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scheduler Info Alert */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3 text-sm text-slate-300">
        <Info className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold text-white">How this scheduler works:</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select a day from the sidebar. Choose quick slots or create a custom slot. When students search for tutors, the recommendation engine calculates matching coefficients based on your intersecting availability slots.
          </p>
        </div>
      </div>

      {/* Scheduler Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Day Selection Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 shadow-lg shadow-slate-950/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Days of the Week</p>
          {DAYS_OF_WEEK.map((day) => {
            const slotCount = schedule[day]?.length || 0;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setErrorMessage('');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                    : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className={`h-4.5 w-4.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{day}</span>
                </div>
                <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  isSelected 
                    ? 'bg-black/25 text-white' 
                    : slotCount > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-950 text-slate-600'
                }`}>
                  <span>{slotCount} slots</span>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Day Planner Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/50 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDay} Schedule</h3>
                <p className="text-xs text-slate-400">Add or manage time slots for this specific day.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToAllDays}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-750 text-xs font-bold transition-all cursor-pointer"
                  title="Copy current day's schedule to all other days"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy to All Days</span>
                </button>
                <button
                  onClick={handleClearDay}
                  className="flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Today</span>
                </button>
              </div>
            </div>

            {/* Current Active Slots */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Slots List ({schedule[selectedDay]?.length || 0})
              </label>
              {(!schedule[selectedDay] || schedule[selectedDay].length === 0) ? (
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-8 text-center text-slate-500 text-xs italic">
                  No active availability slots registered for {selectedDay}. Select from quick slots or add custom times below.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {schedule[selectedDay].map((slot) => (
                    <div
                      key={slot}
                      className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs font-bold text-indigo-400 shadow-sm"
                    >
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{slot}</span>
                      <button
                        onClick={() => handleDeleteSlot(slot)}
                        className="text-slate-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                        title="Remove slot"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Toggle Predefined Slots */}
            <div className="space-y-3 border-t border-slate-850 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Toggle Predefined Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PREDEFINED_SLOTS.map((slot) => {
                  const isActive = schedule[selectedDay]?.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleToggleSlot(slot)}
                      className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Slot */}
            <form onSubmit={handleAddCustomSlot} className="space-y-3 border-t border-slate-850 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Add Custom Slot Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Clock className="absolute left-3.5 top-3 text-slate-600 h-4.5 w-4.5" />
                  <input
                    type="text"
                    value={customSlot}
                    onChange={(e) => setCustomSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="HH:MM-HH:MM (e.g. 09:00-11:00 or 15:30-17:00)"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Add Custom</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
