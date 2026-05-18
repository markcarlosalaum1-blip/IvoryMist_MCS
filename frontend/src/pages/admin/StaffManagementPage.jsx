import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const StaffManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', password: '' });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await API.get('/staff');
      setStaff(res.data || []);
    } catch (err) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) return toast.error('Fill all fields');
    try {
      const res = await API.post('/staff', form);
      setStaff((s) => [res.data, ...s]);
      setForm({ name: '', username: '', password: '' });
      toast.success('Staff created');
    } catch (err) {
      toast.error('Failed to create staff');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff member?')) return;
    try {
      await API.delete(`/staff/${id}`);
      setStaff((s) => s.filter((p) => p.id !== id));
      toast.success('Staff deleted');
    } catch (err) {
      toast.error('Failed to delete staff');
    }
  };

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .staff-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          gap: 0;
        }

        .section-header {
          margin-bottom: 28px;
          flex-shrink: 0;
        }

        .section-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #00d4ff;
          letter-spacing: -0.5px;
          margin: 0 0 12px;
        }

        .section-header p {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.02em;
          margin: 0;
          font-weight: 300;
        }

        .staff-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 32px;
          flex: 1;
          min-height: 0;
          width: 100%;
        }

        .staff-form {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          padding: 32px;
          border-radius: 20px;
          height: fit-content;
          position: sticky;
          top: 0;
          transition: all 0.3s ease;
        }

        .staff-form:hover {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .staff-form h2 {
          font-family: 'Playfair Display', serif;
          margin: 0 0 28px;
          color: #00d4ff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .staff-form .form-group {
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .staff-form .form-group:last-of-type {
          margin-bottom: 28px;
        }

        .staff-form label {
          font-size: 12px;
          color: rgba(0, 212, 255, 0.85);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .staff-form input {
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.92);
          width: 100%;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .staff-form input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .staff-form input:focus {
          outline: none;
          border-color: rgba(0, 212, 255, 0.6);
          background: rgba(0, 212, 255, 0.1);
          box-shadow: 0 0 16px rgba(0, 212, 255, 0.25);
        }

        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover {
          -webkit-text-fill-color: rgba(255, 255, 255, 0.92) !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(0, 212, 255, 0.1) inset !important;
          box-shadow: 0 0 0px 1000px rgba(0, 212, 255, 0.1) inset !important;
          -webkit-transition: background-color 5000s ease-in-out 0s;
          transition: background-color 5000s ease-in-out 0s;
        }

        .btn-primary {
          padding: 16px 28px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
          width: 100%;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
        }

        .btn-primary:active {
          transform: translateY(-1px);
        }

        .staff-list {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          padding: 40px;
          border-radius: 20px;
          overflow-x: auto;
        }

        .staff-list h2 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.3px;
          margin: 0 0 28px;
        }

        .admin-table {
          width: 100%;
          min-width: 500px;
          border-collapse: collapse;
        }

        .admin-table thead {
          background: rgba(0, 212, 255, 0.08);
          border-bottom: 1.5px solid rgba(0, 212, 255, 0.2);
        }

        .admin-table th {
          padding: 18px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00d4ff;
          text-align: left;
        }

        .admin-table td {
          padding: 18px 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        }

        .admin-table tbody tr:hover {
          background: rgba(0, 212, 255, 0.05);
        }

        .btn-danger {
          padding: 8px 16px;
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-danger:hover {
          background: rgba(255, 107, 107, 0.15);
          border-color: rgba(255, 107, 107, 0.6);
          transform: translateY(-2px);
        }

        .empty-staff {
          text-align: center;
          padding: 60px 40px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 15px;
          letter-spacing: 0.02em;
        }

        @media (max-width: 1024px) {
          .staff-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .staff-form {
            position: static;
            height: auto;
          }

          .section-header h1 {
            font-size: 32px;
          }
          
          .staff-list {
            padding: 24px;
          }
          
          .staff-form {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .section-header h1 {
            font-size: 28px;
          }

          .staff-form {
            padding: 28px;
          }

          .staff-list {
            padding: 28px;
          }

          .admin-table th,
          .admin-table td {
            padding: 14px 12px;
            font-size: 12px;
          }

          .staff-list h2,
          .staff-form h2 {
            font-size: 20px;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .section-header h1 {
            font-size: 24px;
          }

          .section-header p {
            font-size: 13px;
          }

          .staff-form {
            padding: 20px;
          }

          .staff-list {
            padding: 20px;
          }

          .staff-form .form-group {
            margin-bottom: 18px;
          }

          .admin-table {
            font-size: 11px;
          }

          .admin-table th,
          .admin-table td {
            padding: 10px 8px;
          }

          .btn-primary {
            padding: 14px 20px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="staff-wrapper">
        <div className="section-header">
          <h1>Staff Management</h1>
          <p>Add, edit, and manage your staff members</p>
        </div>

        <div className="staff-grid">
          <form className="staff-form" onSubmit={handleCreate}>
            <h2>Add Staff</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input 
              name="username" 
              value={form.username} 
              onChange={handleChange}
              type="text"
              placeholder="johndoe"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              name="password" 
              value={form.password} 
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn-primary" type="submit">➕ Create Staff</button>
        </form>

        <div className="staff-list">
          <h2>Existing Staff</h2>
          {loading ? (
            <p style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '40px 0', fontSize: '14px'}}>
              Loading staff members...
            </p>
          ) : staff.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td style={{fontWeight: 600}}>{s.name}</td>
                    <td>{s.username}</td>
                    <td style={{color: 'rgba(0, 212, 255, 0.8)'}}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {s.role || 'staff'}
                      </span>
                    </td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleDelete(s.id)}
                        type="button"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-staff">
              <p style={{fontSize: '16px', marginBottom: '8px'}}>No staff members yet</p>
              <p style={{fontSize: '14px', opacity: 0.7}}>Use the form on the left to add your first staff member</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default StaffManagementPage;
