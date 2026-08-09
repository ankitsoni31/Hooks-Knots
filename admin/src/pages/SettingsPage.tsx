import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function SettingsPage() {
    const { admin, mutate } = useAdminAuth();
    
    // Profile State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [theme, setTheme] = useState('system');
    const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (admin) {
            setFirstName(admin.first_name || '');
            setLastName(admin.last_name || '');
            setTheme(admin.theme || 'system');
        }
    }, [admin]);

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        setSavingProfile(true);
        setProfileStatus(null);
        try {
            await api.put('/admin/profile', {
                first_name: firstName,
                last_name: lastName,
                theme,
                notifications_enabled: true
            });
            setProfileStatus({ type: 'success', msg: 'Profile updated successfully.' });
            setTimeout(() => window.location.reload(), 1000); // Refresh admin context
        } catch (err: any) {
            setProfileStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSavingProfile(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordStatus(null);
        
        if (newPassword !== confirmPassword) {
            setPasswordStatus({ type: 'error', msg: 'New passwords do not match.' });
            setSavingPassword(false);
            return;
        }
        
        if (newPassword.length < 6) {
            setPasswordStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
            setSavingPassword(false);
            return;
        }

        try {
            await api.put('/admin/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setPasswordStatus({ type: 'success', msg: 'Password changed successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to change password.' });
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Manage your account preferences and security.</p>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Profile & Preferences</h3>
                {profileStatus && (
                    <div className="mb-4" style={{ padding: '12px', borderRadius: '8px', backgroundColor: profileStatus.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: profileStatus.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                        {profileStatus.msg}
                    </div>
                )}
                <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" value={admin?.email || ''} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be changed here.</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Theme Preference</label>
                        <select className="form-input" value={theme} onChange={e => setTheme(e.target.value)}>
                            <option value="light">Light Mode</option>
                            <option value="dark">Dark Mode</option>
                            <option value="system">System Default</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                            {savingProfile ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                {passwordStatus && (
                    <div className="mb-4" style={{ padding: '12px', borderRadius: '8px', backgroundColor: passwordStatus.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: passwordStatus.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                        {passwordStatus.msg}
                    </div>
                )}
                <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-danger" disabled={savingPassword}>
                            {savingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
