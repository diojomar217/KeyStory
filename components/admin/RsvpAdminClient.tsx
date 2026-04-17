"use client";

import { useState, useMemo } from 'react';

type RsvpRecord = {
  id: string;
  site_id: string;
  name: string;
  contact_number?: string;
  attendance: string;
  godparent_confirmation?: string;
  companions?: number;
  message?: string;
  created_at?: string;
};

export default function RsvpAdminClient({
  siteId,
  initialRsvps,
}: {
  siteId: string;
  initialRsvps: RsvpRecord[];
}) {
  const [rsvps, setRsvps] = useState<RsvpRecord[]>(initialRsvps || []);
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');
  const [godparentOnly, setGodparentOnly] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      if (attendanceFilter !== 'all' && r.attendance !== attendanceFilter) return false;
      if (godparentOnly && (r.godparent_confirmation || '') !== 'yes') return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        if (!r.name.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [rsvps, attendanceFilter, godparentOnly, search]);

  const summary = useMemo(() => {
    const total = rsvps.length;
    const yes = rsvps.filter((r) => r.attendance === 'yes').length;
    const no = rsvps.filter((r) => r.attendance === 'no').length;
    const maybe = rsvps.filter((r) => r.attendance === 'maybe').length;
    const totalCompanions = rsvps.reduce((acc, r) => acc + (r.companions || 0), 0);
    return { total, yes, no, maybe, totalCompanions };
  }, [rsvps]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this RSVP?')) return;
    try {
      const res = await fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        setRsvps((cur) => cur.filter((r) => r.id !== id));
      } else {
        alert(json?.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  function exportCsv() {
    const headers = ['Name', 'Contact', 'Attendance', 'Godparent', 'Companions', 'Message', 'Date'];
    const rows = rsvps.map((r) => [
      r.name,
      r.contact_number || '',
      r.attendance,
      r.godparent_confirmation || '',
      String(r.companions || 0),
      (r.message || '').replace(/\n/g, ' '),
      r.created_at || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps_${siteId || 'site'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">Total RSVPs: {summary.total}</div>
          <div className="text-sm text-muted">Yes: {summary.yes}</div>
          <div className="text-sm text-muted">No: {summary.no}</div>
          <div className="text-sm text-muted">Maybe: {summary.maybe}</div>
          <div className="text-sm text-muted">Companions: {summary.totalCompanions}</div>
        </div>

        <div className="flex items-center gap-2">
          <select value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value as any)} className="select select-bordered">
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={godparentOnly} onChange={(e) => setGodparentOnly(e.target.checked)} />
            <span className="text-sm">Godparents only</span>
          </label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name" className="input input-sm input-bordered" />
          <button className="btn btn-sm" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Attendance</th>
              <th>Godparent</th>
              <th>Companions</th>
              <th>Message</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.name}</td>
                <td>{r.contact_number}</td>
                <td>{r.attendance}</td>
                <td>{r.godparent_confirmation}</td>
                <td>{r.companions || 0}</td>
                <td>{r.message}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
