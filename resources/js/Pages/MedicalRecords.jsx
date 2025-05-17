import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MedicalRecords({ patientId }) {
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({ diagnosis: '', visit_date: '', prescription: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, [patientId]);

    const fetchRecords = () => {
        axios.get(`/api/patients/${patientId}/records`)
            .then(res => setRecords(res.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            diagnosis: form.diagnosis,
            visit_date: form.visit_date,
            prescription: form.prescription,
        };

        if (editingId) {
            axios.put(`/api/records/${editingId}`, payload)
                .then(res => {
                    setRecords(records.map(r => r.id === editingId ? res.data : r));
                    resetForm();
                })
                .catch(err => {
                    console.error('Update failed:', err.response?.data || err.message);
                });
        } else {
            axios.post(`/api/patients/${patientId}/records`, payload)
                .then(res => {
                    setRecords([...records, res.data]);
                    resetForm();
                })
                .catch(err => {
                    console.error('Create failed:', err.response?.data || err.message);
                });
        }
    };

    const resetForm = () => {
        setForm({ diagnosis: '', visit_date: '', prescription: '' });
        setEditingId(null);
    };

    const handleEdit = (record) => {
        setForm({
            diagnosis: record.diagnosis || '',
            visit_date: record.visit_date || '',
            prescription: record.prescription || ''
        });
        setEditingId(record.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this record?')) {
            axios.delete(`/api/records/${id}`).then(() => {
                setRecords(records.filter(r => r.id !== id));
            });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Medical Records</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Diagnosis</label>
                    <textarea
                        className="form-control"
                        placeholder="Diagnosis"
                        value={form.diagnosis}
                        onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Visit Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={form.visit_date}
                        onChange={e => setForm({ ...form, visit_date: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Prescription</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Prescription"
                        value={form.prescription}
                        onChange={e => setForm({ ...form, prescription: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">
                    {editingId ? 'Update' : 'Add'} Record
                </button>
                {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </form>

            <ul className="list-group">
                {records.map(r => (
                    <li key={r.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div><strong>{r.visit_date}</strong>: {r.diagnosis}</div>
                            {r.prescription && (
                                <div><em>Prescription:</em> {r.prescription}</div>
                            )}
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(r)}>
                                Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
