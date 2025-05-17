import { useEffect, useState } from 'react';
import axios from 'axios';
import MedicalRecords from './MedicalRecords';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({ first_name: '', last_name: '' });
    const [editingId, setEditingId] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        axios.get('/api/patients').then(res => setPatients(res.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            axios.put(`/api/patients/${editingId}`, form).then(res => {
                setPatients(patients.map(p => (p.id === editingId ? res.data : p)));
                setForm({ first_name: '', last_name: '' });
                setEditingId(null);
            });
        } else {
            axios.post('/api/patients', form).then(res => {
                setPatients([...patients, res.data]);
                setForm({ first_name: '', last_name: '' });
            });
        }
    };

    const handleEdit = (patient) => {
        setForm({ first_name: patient.first_name, last_name: patient.last_name });
        setEditingId(patient.id);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            axios.delete(`/api/patients/${id}`).then(() => {
                setPatients(patients.filter(p => p.id !== id));
            });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Patients</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-5">
                            <input
                                className="form-control"
                                placeholder="First Name"
                                value={form.first_name}
                                onChange={e => setForm({ ...form, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-5">
                            <input
                                className="form-control"
                                placeholder="Last Name"
                                value={form.last_name}
                                onChange={e => setForm({ ...form, last_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button type="submit" className="btn btn-primary w-100">
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({ first_name: '', last_name: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <ul className="list-group">
                {patients.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{p.first_name} {p.last_name}</strong>
                        </div>
                        <div className="btn-group btn-group-sm">
                            <button className="btn btn-info text-white" onClick={() => setSelectedPatient(p)}>
                                View Records
                            </button>
                            <button className="btn btn-warning" onClick={() => handleEdit(p)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedPatient && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h4>
                            Medical Records for: {selectedPatient.first_name} {selectedPatient.last_name}
                        </h4>
                        <MedicalRecords patientId={selectedPatient.id} />
                        <button className="btn btn-secondary mt-3" onClick={() => setSelectedPatient(null)}>
                            Close Records
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
