import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://akcbgvpdbxepgoklpuia.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY2JndnBkYnhlcGdva2xwdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTI4NzMsImV4cCI6MjEwNTM4ODg3M30.DpF9XHryOBG9SJ3yS_kQ2nDuQmtZnFypp6I5ayD1imY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ROLE_OPTIONS = ['ADMIN', 'PIC', 'ME', 'VIEWER'];

export default function DPWHAdminPanel() {
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [successMsg, setSuccessMsg] = useState(null);

  // Data states
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ 
    email: '', username: '', password: '', full_name: '', role: 'ME' 
  });
  const [newProject, setNewProject] = useState({
    contract_id: '', project_name: '', location: '', contractor: '',
    contract_amount: '', calendar_days: '', noa_date: '', ntp_date: '', expiry_date: ''
  });

  useEffect(() => {
    if (!showLogin && currentUser) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 5000); // Refresh every 5s
      return () => clearInterval(interval);
    }
  }, [showLogin, currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        setError('Invalid username or password');
        return;
      }

      if (userData.password_hash !== password) {
        setError('Invalid username or password');
        return;
      }

      // Check if admin
      if (userData.role !== 'ADMIN' && userData.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      setCurrentUser(userData);
      setShowLogin(false);
      setSuccessMsg(`✅ Welcome back, ${userData.full_name}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setUsername('');
    setPassword('');
  };

  const fetchAllData = async () => {
    try {
      const { data: usersData } = await supabase.from('users').select('*').order('id');
      setUsers(usersData || []);

      const { data: projectsData } = await supabase.from('projects').select('*').order('id');
      setProjects(projectsData || []);

      const { data: testsData } = await supabase.from('material_tests').select('*').order('id');
      setTests(testsData || []);

      const { data: paymentsData } = await supabase.from('test_payments').select('*').order('id');
      setPayments(paymentsData || []);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  // CREATE USER
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.username || !newUser.password || !newUser.full_name) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('users').insert([{
        email: newUser.email,
        username: newUser.username,
        password_hash: newUser.password,
        full_name: newUser.full_name,
        role: newUser.role || 'ME'
      }]);

      if (error) throw error;

      setSuccessMsg(`✅ User "${newUser.username}" created as ${newUser.role}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setNewUser({ email: '', username: '', password: '', full_name: '', role: 'ME' });
      setShowUserForm(false);
      fetchAllData();
    } catch (err) {
      alert('❌ Error creating user: ' + err.message);
    }
  };

  // UPDATE USER ROLE
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setSuccessMsg('✅ User role updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchAllData();
    } catch (err) {
      alert('❌ Error updating role: ' + err.message);
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async () => {
    if (!newProject.contract_id || !newProject.project_name || !newProject.location) {
      alert('Please fill required fields (Contract ID, Project Name, Location)');
      return;
    }

    try {
      const nextId = Math.max(...projects.map(p => p.id), 0) + 1;

      const { error } = await supabase.from('projects').insert([{
        id: nextId,
        contract_id: newProject.contract_id,
        project_name: newProject.project_name,
        location: newProject.location,
        contractor: newProject.contractor || 'TBD',
        contract_amount: parseInt(newProject.contract_amount) || 0,
        calendar_days: parseInt(newProject.calendar_days) || 0,
        noa_date: newProject.noa_date || null,
        ntp_date: newProject.ntp_date || null,
        expiry_date: newProject.expiry_date || null,
        created_by: currentUser.id
      }]);

      if (error) throw error;

      setSuccessMsg(`✅ Project "${newProject.project_name}" created!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setNewProject({
        contract_id: '', project_name: '', location: '', contractor: '',
        contract_amount: '', calendar_days: '', noa_date: '', ntp_date: '', expiry_date: ''
      });
      setShowProjectForm(false);
      fetchAllData();
    } catch (err) {
      alert('❌ Error creating project: ' + err.message);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;
        setSuccessMsg('✅ User deleted');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchAllData();
      } catch (err) {
        alert('❌ Error: ' + err.message);
      }
    }
  };

  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure? Deleting this project will also remove all related tests and payments.')) {
      try {
        // Delete related payments
        const testsToDelete = tests.filter(t => t.project_id === projectId);
        const testIds = testsToDelete.map(t => t.id);
        
        if (testIds.length > 0) {
          await supabase.from('test_payments').delete().in('test_id', testIds);
          await supabase.from('test_results').delete().in('test_id', testIds);
          await supabase.from('material_tests').delete().eq('project_id', projectId);
        }
        
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) throw error;
        
        setSuccessMsg('✅ Project and related data deleted');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchAllData();
      } catch (err) {
        alert('❌ Error: ' + err.message);
      }
    }
  };

  // LOGIN PAGE
  if (showLogin) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'white' }}>
          <div style={{ maxWidth: '500px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>DPWH</div>
            <div style={{ fontSize: '14px', marginBottom: '32px', opacity: 0.9, lineHeight: '1.6' }}>ILOCOS SUR 1ST DISTRICT<br/>ENGINEERING OFFICE</div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '32px 0 8px 0' }}>ADMIN PANEL</h1>
            <h2 style={{ fontSize: '28px', fontWeight: '300', margin: '0 0 32px 0', opacity: 0.95 }}>Material Testing System</h2>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'white' }}>
          <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: '#1e3a8a' }}>Admin Login</h2>
            
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', borderLeft: '4px solid #991b1b' }}>⚠️ {error}</div>}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : '🔓 Admin Login'}
            </button>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
              <strong>Demo Admin Credentials:</strong><br/>
              Username: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>admin</code><br/>
              Password: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  const AdminDashboard = () => (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '600' }}>📊 Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Welcome, <strong>{currentUser?.full_name}</strong>! You have full system access.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="👥 Total Users" value={users.length} color="#3b82f6" />
        <StatCard label="📁 Total Projects" value={projects.length} color="#f59e0b" />
        <StatCard label="🧪 Material Tests" value={tests.length} color="#10b981" />
        <StatCard label="💳 Total Payments" value={`₱${(payments.reduce((s, p) => s + (p.amount_paid || 0), 0) / 1000000).toFixed(1)}M`} color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <ActionCard
          title="👥 Manage Users"
          description="Create, edit, and delete users with role assignment"
          buttonText="Go to Users"
          onClick={() => setActiveMenu('users')}
          color="#3b82f6"
        />
        <ActionCard
          title="📁 Manage Projects"
          description="Create, edit, and delete DPWH projects"
          buttonText="Go to Projects"
          onClick={() => setActiveMenu('projects')}
          color="#f59e0b"
        />
        <ActionCard
          title="🧪 Material Tests"
          description="View and track all material testing activities"
          buttonText="View Tests"
          onClick={() => setActiveMenu('tests')}
          color="#10b981"
        />
        <ActionCard
          title="💳 Payment Tracking"
          description="Monitor and manage test payment status"
          buttonText="View Payments"
          onClick={() => setActiveMenu('payments')}
          color="#8b5cf6"
        />
      </div>
    </div>
  );

  // USER MANAGEMENT
  const UserManagement = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>👥 User Management</h2>
        <button
          onClick={() => setShowUserForm(!showUserForm)}
          style={{ padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showUserForm ? '✕ Cancel' : '+ Add New User'}
        </button>
      </div>

      {showUserForm && (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Create New User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Email *</label>
              <input type="email" placeholder="user@dpwh.gov.ph" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Username *</label>
              <input type="text" placeholder="username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Password *</label>
              <input type="password" placeholder="••••••••" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Full Name *</label>
              <input type="text" placeholder="Full Name" value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Role *</label>
              <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', background: 'white' }}>
                {ROLE_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreateUser}
            style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
          >
            ✓ Create User
          </button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Username</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Full Name</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Role</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', background: user.role === 'ADMIN' ? '#fef3c7' : 'transparent' }}>
                  <td style={{ padding: '12px' }}><strong>{user.username}</strong></td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.full_name}</td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={user.role || 'ME'} 
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        background: user.role === 'ADMIN' ? '#fecaca' : user.role === 'PIC' ? '#bfdbfe' : user.role === 'ME' ? '#d1fae5' : '#f3f4f6',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {ROLE_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No users yet. Create one to get started!</div>}
        </div>
      </div>
    </div>
  );

  // PROJECT MANAGEMENT
  const ProjectManagement = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>📁 Project Management</h2>
        <button
          onClick={() => setShowProjectForm(!showProjectForm)}
          style={{ padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showProjectForm ? '✕ Cancel' : '+ Add New Project'}
        </button>
      </div>

      {showProjectForm && (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Create New Project</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Contract ID *</label>
              <input type="text" placeholder="CNT-001" value={newProject.contract_id} onChange={(e) => setNewProject({...newProject, contract_id: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Project Name *</label>
              <input type="text" placeholder="Road Upgrade" value={newProject.project_name} onChange={(e) => setNewProject({...newProject, project_name: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Location *</label>
              <input type="text" placeholder="Vigan City" value={newProject.location} onChange={(e) => setNewProject({...newProject, location: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Contractor</label>
              <input type="text" placeholder="ABC Construction" value={newProject.contractor} onChange={(e) => setNewProject({...newProject, contractor: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Contract Amount (₱)</label>
              <input type="number" placeholder="10000000" value={newProject.contract_amount} onChange={(e) => setNewProject({...newProject, contract_amount: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Calendar Days</label>
              <input type="number" placeholder="180" value={newProject.calendar_days} onChange={(e) => setNewProject({...newProject, calendar_days: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>NOA Date</label>
              <input type="date" value={newProject.noa_date} onChange={(e) => setNewProject({...newProject, noa_date: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>NTP Date</label>
              <input type="date" value={newProject.ntp_date} onChange={(e) => setNewProject({...newProject, ntp_date: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '4px' }}>Expiry Date</label>
              <input type="date" value={newProject.expiry_date} onChange={(e) => setNewProject({...newProject, expiry_date: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button
            onClick={handleCreateProject}
            style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
          >
            ✓ Create Project
          </button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#f9fafb' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600' }}>{project.project_name}</h4>
              <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>📍 {project.location}</p>
              <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>🔗 {project.contract_id}</p>
              <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>💼 {project.contractor || 'TBD'}</p>
              <p style={{ margin: '8px 0 12px 0', fontSize: '12px', color: '#1e40af', fontWeight: '500' }}>₱{(project.contract_amount / 1000000).toFixed(1)}M • {project.calendar_days} days</p>
              <button
                onClick={() => handleDeleteProject(project.id)}
                style={{ width: '100%', padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
              >
                🗑️ Delete Project
              </button>
            </div>
          ))}
        </div>
        {projects.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No projects yet. Create your first project!</div>}
      </div>
    </div>
  );

  // TESTS VIEW
  const TestsView = () => (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '600' }}>🧪 Material Tests</h2>
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Test Code</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Project</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Center</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Sample Date</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Submit Date</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}><strong>{test.test_code}</strong></td>
                  <td style={{ padding: '12px' }}>{test.test_type}</td>
                  <td style={{ padding: '12px' }}>Project {test.project_id}</td>
                  <td style={{ padding: '12px', fontSize: '11px' }}>{test.testing_center || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '11px' }}>{test.sample_date}</td>
                  <td style={{ padding: '12px', fontSize: '11px' }}>{test.submit_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tests.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No tests yet. Create projects first, then add tests.</div>}
        </div>
      </div>
    </div>
  );

  // PAYMENTS VIEW
  const PaymentsView = () => (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '600' }}>💳 Payment Tracking</h2>
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Test ID</th>
                <th style={{ textAlign: 'right', padding: '12px', fontWeight: '600' }}>Amount Due</th>
                <th style={{ textAlign: 'right', padding: '12px', fontWeight: '600' }}>Amount Paid</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Payment Date</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}><strong>Test {payment.test_id}</strong></td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>₱{payment.amount_due?.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>₱{payment.amount_paid?.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: payment.payment_status === 'PAID' ? '#d1fae5' : '#fef3c7', color: payment.payment_status === 'PAID' ? '#065f46' : '#92400e', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' }}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px' }}>{payment.payment_date}</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#6b7280' }}>{payment.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No payments yet. Add material tests first.</div>}
        </div>
      </div>
    </div>
  );

  const StatCard = ({ label, value, color }) => (
    <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
      <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  );

  const ActionCard = ({ title, description, buttonText, onClick, color }) => (
    <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `2px solid ${color}` }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color }}>{title}</h3>
      <p style={{ margin: '8px 0 16px 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{description}</p>
      <button
        onClick={onClick}
        style={{ width: '100%', padding: '10px', background: color, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
      >
        {buttonText} →
      </button>
    </div>
  );

  // MAIN LAYOUT
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#1e40af', color: 'white', padding: '24px 0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 20px', marginBottom: '32px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.4' }}>🏗️ DPWH<br/>Admin Panel</div>
          <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.8 }}>Material Testing System</div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'users', label: '👥 Users' },
            { id: 'projects', label: '📁 Projects' },
            { id: 'tests', label: '🧪 Tests' },
            { id: 'payments', label: '💳 Payments' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: activeMenu === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeMenu === item.id ? '500' : '400',
                transition: 'background 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
          <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '12px' }}>👤 {currentUser?.full_name}</div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            🔓 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>🏗️ DPWH Material Testing Admin Panel</h1>
        </div>

        {successMsg && (
          <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 24px', borderBottom: '1px solid #a7f3d0', fontSize: '13px', fontWeight: '500' }}>
            {successMsg}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeMenu === 'dashboard' && <AdminDashboard />}
          {activeMenu === 'users' && <UserManagement />}
          {activeMenu === 'projects' && <ProjectManagement />}
          {activeMenu === 'tests' && <TestsView />}
          {activeMenu === 'payments' && <PaymentsView />}
        </div>
      </div>
    </div>
  );
}
