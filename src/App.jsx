import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw,
  Mail,
  User,
  Sliders,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import banksData from './banks_data.json';

const generateTemplateBody = (type, count) => {
  if (type === 'buyer') {
    let body = `Dear Sir/ Madam,\n\n\nKindly provide the price for below buyer's credit transactions: -\n\n\n`;
    
    const getBlock = (num) => {
      return `Transaction No. ${num}\n\n1. Applicant Name: \n2. SBLC Issuing Bank: \n3. Amount: \n4. Tenor: \n5. Supplier's Name: \n6. Due Date: \n7. Date of Shipment: \n8. Port of Loading: \n9. Port of Discharge: \n10. Commodity: `;
    };

    const blocks = [];
    for (let i = 1; i <= count; i++) {
      blocks.push(getBlock(i));
    }
    body += blocks.join('\n\n\n') + `\n\n\n\nThanks and Regards,\nChitra Ray\nCredance\n9836087478`;
    return body;
    
  } else if (type === 'supplier') {
    let body = `Dear Sir/ Madam,\n\n \nKindly provide the price for below supplier's credit transactions under RA Route:\n\n\n`;
    
    const getBlock = (num) => {
      return `Transaction No. ${num}\n\nApplicant Name: \nOpening Bank: \nAmount: \nTenor: \nSupplier Name: \nCommodity: \nPort of loading: \nPost of discharge: \nConfirmation: \nLast date of shipment: `;
    };

    const blocks = [];
    for (let i = 1; i <= count; i++) {
      blocks.push(getBlock(i));
    }
    body += blocks.join('\n\n\n') + `\n\n\n\nThanks and Regards,\nChitra Ray\nCredance\n9836087478`;
    return body;
  }
  return '';
};

export default function App() {
  // Core App States
  const [recipients, setRecipients] = useState([]);
  const [settings, setSettings] = useState({
    senderName: 'Anshul Somani',
    senderEmail: 'abc@gmail.com',
    pass: '',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    simulatedMode: true // Sandbox simulator active by default
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Form Composer States
  const [subject, setSubject] = useState('Quick update for {company}');
  const [body, setBody] = useState('Hi {name},\n\nHope you are doing well.\n\nBest regards,\nAnshul');
  const [activeTemplate, setActiveTemplate] = useState('');
  const [txnCount, setTxnCount] = useState(1);
  
  // Recipient Selection States
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeBankSelect, setActiveBankSelect] = useState('');
  const [activeCenterSelect, setActiveCenterSelect] = useState('');
  const [toEmails, setToEmails] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  
  // Quick Add Recipient States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');

  // Sending Progression States
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendLogs, setSendLogs] = useState([]);

  // Toggle Settings View (for SMTP setup)
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  // Secure Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('mail_sender_auth') === 'true';
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Auto-hide alerts
  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [recData, settsData, histData] = await Promise.all([
        fetch('/api/recipients').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/history').then(r => r.json())
      ]);
      setRecipients(recData || []);
      if (settsData) {
        setSettings(prev => ({ ...prev, ...settsData }));
      }
      setHistory(histData || []);
    } catch (e) {
      console.error(e);
      setAlert({ type: 'error', message: 'Failed to connect to backend server.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (type, count) => {
    setActiveTemplate(type);
    setTxnCount(count);
    
    if (type === 'buyer') {
      setSubject("Request of buyer's credit transaction");
    } else if (type === 'supplier') {
      setSubject("Request for supplier's credit transactions");
    }

    const updatedBody = generateTemplateBody(type, count);
    setBody(updatedBody);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = loginUser.trim().toLowerCase();
    const pass = loginPass.trim();
    
    if ((user === 'anshul' || user === 'anshulsomani') && pass === 'admin') {
      localStorage.setItem('mail_sender_auth', 'true');
      setIsAuthenticated(true);
      setLoginUser('');
      setLoginPass('');
      triggerAlert('success', 'Access granted. Welcome back, Anshul!');
    } else {
      triggerAlert('error', 'Invalid login credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mail_sender_auth');
    setIsAuthenticated(false);
    triggerAlert('info', 'Securely logged out.');
  };

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
  };

  // Add Recipient
  const handleAddRecipient = async (e) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      const response = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName || newEmail.split('@')[0],
          email: newEmail,
          company: newCompany || 'Individual'
        })
      });
      const res = await response.json();
      if (res.success) {
        triggerAlert('success', 'Recipient added to list.');
        setNewName('');
        setNewEmail('');
        setNewCompany('');
        // Re-fetch recipients
        const recs = await fetch('/api/recipients').then(r => r.json());
        setRecipients(recs);
      } else {
        triggerAlert('error', res.error || 'Failed to save recipient.');
      }
    } catch (err) {
      triggerAlert('error', 'Error adding recipient.');
    }
  };

  // Delete Recipient
  const handleDeleteRecipient = async (id) => {
    try {
      const response = await fetch(`/api/recipients/${id}`, { method: 'DELETE' });
      const res = await response.json();
      if (res.success) {
        setRecipients(prev => prev.filter(r => r.id !== id));
        setSelectedIds(prev => prev.filter(rId => rId !== id));
        triggerAlert('success', 'Recipient removed.');
      }
    } catch (err) {
      triggerAlert('error', 'Error removing recipient.');
    }
  };

  // Save Settings Changes (Sender email, credentials)
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const res = await response.json();
      if (res.success) {
        triggerAlert('success', 'Sender configurations saved successfully.');
        setShowSmtpConfig(false);
      }
    } catch (err) {
      triggerAlert('error', 'Error saving settings.');
    }
  };

  // Send Group Email
  const handleSendCampaign = async () => {
    if (toEmails.length === 0) {
      triggerAlert('error', 'Please select at least one "To" recipient.');
      return;
    }
    if (!subject || !body) {
      triggerAlert('error', 'Subject and body copy cannot be empty.');
      return;
    }

    setIsSending(true);
    setSendProgress(0);
    setSendLogs([`[Init] Connecting with sender account: ${settings.senderEmail}...`]);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const response = await fetch('/api/send_group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customSubject: subject,
          customBody: body,
          toEmails: toEmails,
          ccEmails: ccEmails
        })
      });
      
      setSendProgress(50);
      const res = await response.json();

      if (res.success) {
        setSendProgress(100);
        setSendLogs(prev => [...prev, `✅ Email dispatched to ${toEmails.length} recipient(s) & ${ccEmails.length} CC(s)!`]);
        triggerAlert('success', `Successfully dispatched email!`);
        const hist = await fetch('/api/history').then(r => r.json());
        setHistory(hist || []);
      } else {
        setSendLogs(prev => [...prev, `❌ Failed: ${res.error}`]);
        triggerAlert('error', `Failed to send: ${res.error}`);
      }
    } catch (err) {
      setSendLogs(prev => [...prev, `❌ Network error connecting to mail server.`]);
      triggerAlert('error', 'Error connecting to mail engine.');
    } finally {
      setTimeout(() => {
        setIsSending(false);
        setSendProgress(0);
        setSendLogs([]);
      }, 3000);
    }
  };
        


  const toggleSelectRecipient = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === recipients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recipients.map(r => r.id));
    }
  };

  // Variable injection helpers
  const insertToken = (token) => {
    setBody(prev => prev + ` {${token}}`);
  };

  if (!isAuthenticated) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)',
          fontFamily: 'var(--font-family)',
          color: 'var(--text-primary)',
          padding: '1.5rem'
        }}
      >
        <div 
          className="glass-panel" 
          style={{ 
            width: '100%', 
            maxWidth: '420px', 
            padding: '2.5rem', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-accent)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div 
              className="brand-icon" 
              style={{ 
                width: '52px', 
                height: '52px', 
                fontSize: '1.75rem', 
                borderRadius: '12px', 
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✉️
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' }}>
              Mail Sender Studio
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Enterprise Bulk Dispatch • Secure Authentication
            </p>
          </div>

          {alert && (
            <div style={{ 
              background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid var(--color-${alert.type === 'error' ? 'danger' : 'success'})`,
              color: `var(--color-${alert.type === 'error' ? 'danger' : 'success'})`,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Authorized Login ID</label>
              <input 
                type="text" 
                required
                className="form-control" 
                placeholder="Username (e.g. anshul)"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Security Keyphrase / Password</label>
              <input 
                type="password" 
                required
                className="form-control" 
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
            >
              Sign In to Dashboard
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            System IP Address: <strong>127.0.0.1 (Local Node)</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-workspace" style={{ maxWidth: '100%', width: '100%', margin: '0 auto', padding: '1.5rem 2.5rem' }}>
      
      {/* HEADER BANNER */}
      <header className="page-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '1rem', borderRadius: '8px' }}>✉️</div>
            <span className="brand-name" style={{ fontSize: '1.25rem' }}>Mail Sender Studio</span>
          </div>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>A simple, single-screen dashboard to compose and dispatch bulk mail.</p>
        </div>

        {/* SANDBOX BANNER STATUS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: settings.simulatedMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: '1px solid ' + (settings.simulatedMode ? 'var(--color-warning)' : 'var(--color-success)'),
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            <span className="status-indicator" style={{ 
              backgroundColor: settings.simulatedMode ? 'var(--color-warning)' : 'var(--color-success)',
              boxShadow: 'none'
            }}></span>
            <span style={{ fontWeight: 600 }}>
              {settings.simulatedMode ? 'Sandbox Simulator Active' : 'SMTP Server Connected'}
            </span>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowSmtpConfig(!showSmtpConfig)}
          >
            <Settings size={14} /> Configure SMTP
          </button>
          
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ 
              borderColor: 'rgba(239, 68, 68, 0.25)', 
              color: 'var(--color-danger)',
              background: 'rgba(239, 68, 68, 0.03)'
            }}
            onClick={handleLogout}
            title="Lock Dashboard & Log Out"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      {/* GLOBAL ALERTS */}
      {alert && (
        <div className={`notification-banner glass-panel`} style={{
          marginBottom: '1.5rem',
          borderLeft: `4px solid var(--color-${alert.type === 'error' ? 'danger' : 'success'})`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {alert.type === 'error' ? <AlertCircle size={18} className="color-danger" /> : <CheckCircle2 size={18} className="color-success" />}
            <span style={{ fontSize: '0.9rem' }}>{alert.message}</span>
          </div>
          <X size={16} className="notification-banner-close" onClick={() => setAlert(null)} />
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
          <RotateCw size={36} className="color-primary" style={{ animation: 'spin 1.5s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Preparing mail engine workspace...</p>
        </div>
      ) : (
        <div className="dashboard-responsive-grid">
          
          {/* LEFT WING: SENDER & MESSAGE COMPOSER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* SMTP CONFIGURATION SLIDE-IN */}
            {showSmtpConfig && (
              <div className="glass-panel widget-card" style={{ border: '1px solid var(--border-accent)', animation: 'slide-up 0.25s forwards' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>SMTP Credentials Setup</h3>
                  <X size={16} style={{ cursor: 'pointer' }} onClick={() => setShowSmtpConfig(false)} />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      className="checkbox-input"
                      checked={settings.simulatedMode}
                      onChange={(e) => setSettings(prev => ({ ...prev, simulatedMode: e.target.checked }))}
                    />
                    <span>Run in simulated Sandbox Mode (No real emails sent)</span>
                  </label>
                </div>

                {!settings.simulatedMode && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">SMTP Server Host</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="smtp.gmail.com"
                          value={settings.host}
                          onChange={(e) => setSettings(prev => ({ ...prev, host: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Port</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="465"
                          value={settings.port}
                          onChange={(e) => setSettings(prev => ({ ...prev, port: parseInt(e.target.value) || '' }))}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          className="checkbox-input"
                          checked={settings.secure}
                          onChange={(e) => setSettings(prev => ({ ...prev, secure: e.target.checked }))}
                        />
                        <span>Secure SSL/TLS Connection</span>
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">SMTP Username</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="your-email@gmail.com"
                          value={settings.user}
                          onChange={(e) => setSettings(prev => ({ ...prev, user: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SMTP Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          placeholder="App Password"
                          value={settings.pass}
                          onChange={(e) => setSettings(prev => ({ ...prev, pass: e.target.value }))}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveSettings}>Save Configuration</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowSmtpConfig(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* HELP SETUP GUIDE CARD */}
            <div className="glass-panel" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', height: 'auto' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setShowHelpGuide(!showHelpGuide)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-primary)' }}>
                  <span>💡</span>
                  <span>How to Send Real Emails (SMTP Setup Guide)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {showHelpGuide ? 'Collapse ▲' : 'Expand Setup Steps ▼'}
                </span>
              </div>

              {showHelpGuide && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Follow these simple steps to connect your Gmail account:
                  </p>
                  <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0 0 0.75rem' }}>
                    <li>Click <strong>Configure SMTP</strong> in the top header.</li>
                    <li>Uncheck the <strong>Sandbox Mode</strong> box.</li>
                    <li>Enter Host as <code>smtp.gmail.com</code> and Port as <code>465</code> (Secure SSL checked).</li>
                    <li>In the <strong>SMTP Username</strong> field, type your email (e.g. <code>abc@gmail.com</code>).</li>
                  </ol>
                  
                  <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.65rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                      🔑 Step 5: How to get your Google App Password:
                    </strong>
                    <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: 0 }}>
                      <li>Go to Google Account: <a href="https://myaccount.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>myaccount.google.com</a></li>
                      <li>Go to <strong>Security</strong> &gt; Make sure <strong>2-Step Verification</strong> is turned <strong>ON</strong>.</li>
                      <li>Search for <strong>"App passwords"</strong> in the top Google search bar.</li>
                      <li>Create an app named <code>Mail Sender</code>, click <strong>Generate</strong>, and copy the <strong>16-letter password</strong> (e.g. <code>tsyk myow fppd nkne</code>).</li>
                      <li>Paste it into the <strong>SMTP Password</strong> field in the Configure SMTP box!</li>
                    </ol>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>
                    ✓ Click Save Configuration and you are immediately online!
                  </p>
                </div>
              )}
            </div>

            {/* MESSAGE COMPOSER CARD */}
            <div className="glass-panel widget-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} className="color-primary" />
                Compose Mail Campaign
              </h3>

              {/* 1. SENDER CONFIG */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Sender Display Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Anshul Somani"
                    value={settings.senderName}
                    onChange={(e) => setSettings(prev => ({ ...prev, senderName: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Sender Email ID (From)</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="abc@gmail.com"
                    value={settings.senderEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Carbon Copy (CC)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value="credanceforex@gmail.com"
                    disabled
                    style={{ opacity: 0.8, cursor: 'not-allowed', color: 'var(--color-primary)', fontWeight: 600 }}
                  />
                  <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Always included automatically.</small>
                </div>
              </div>

              {/* PREMIUM DYNAMIC TEMPLATE STUDIO */}
              <div className="form-group" style={{ marginBottom: '1.25rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="form-label" style={{ margin: 0, fontWeight: 700 }}>Select Credit Template</span>
                  {(activeTemplate || txnCount > 1) && (
                    <button 
                      type="button" 
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                      onClick={() => {
                        setActiveTemplate('');
                        setTxnCount(1);
                        setSubject('');
                        setBody('');
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {/* Template Type Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      background: activeTemplate === 'buyer' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                      color: 'white',
                      border: activeTemplate === 'buyer' ? 'none' : '1px solid var(--border-light)',
                      boxShadow: activeTemplate === 'buyer' ? 'var(--gradient-glow)' : 'none',
                    }}
                    onClick={() => handleTemplateSelect('buyer', txnCount)}
                  >
                    📥 Buyer's Credit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      background: activeTemplate === 'supplier' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                      color: 'white',
                      border: activeTemplate === 'supplier' ? 'none' : '1px solid var(--border-light)',
                      boxShadow: activeTemplate === 'supplier' ? 'var(--gradient-glow)' : 'none',
                    }}
                    onClick={() => handleTemplateSelect('supplier', txnCount)}
                  >
                    📤 Supplier Credit
                  </button>
                </div>

                {/* Transaction Count Selector */}
                {activeTemplate && (
                  <div style={{ marginTop: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
                    <span className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Number of Transactions</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className="btn btn-sm"
                          style={{
                            flex: 1,
                            padding: '0.35rem 0',
                            background: txnCount === num ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.03)',
                            color: 'white',
                            border: '1px solid ' + (txnCount === num ? 'var(--color-primary)' : 'var(--border-light)'),
                            borderRadius: '4px',
                            fontWeight: txnCount === num ? 700 : 500
                          }}
                          onClick={() => handleTemplateSelect(activeTemplate, num)}
                        >
                          {num} Txn{num > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SUBJECT LINE */}
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Subject Line</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Type mail subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* 3. MESSAGE BODY */}
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Email Content Body</label>
                <textarea 
                  className="form-control"
                  style={{ minHeight: '380px', fontFamily: 'Courier New, Courier, monospace', fontSize: '0.82rem', whiteSpace: 'pre', overflowX: 'auto' }}
                  placeholder="Hi {name}, type body copy..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                
                {/* Dynamically Personalize Helper */}
                <div className="variables-helper">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Personalization tokens:</span>
                  <div style={{ marginTop: '0.2rem' }}>
                    <span className="variable-tag" onClick={() => insertToken('name')}>{'{name}'}</span>
                    <span className="variable-tag" onClick={() => insertToken('company')}>{'{company}'}</span>
                    <span className="variable-tag" onClick={() => insertToken('email')}>{'{email}'}</span>
                  </div>
                </div>
              </div>

              {/* 4. PROGRESSION LOGS BAR AND ACTIONS */}
              {isSending ? (
                <div className="sending-progress-container" style={{ margin: '1rem 0 0' }}>
                  <div className="sending-progress-header">
                    <span style={{ fontWeight: 'bold' }}>Progress Status</span>
                    <span>{sendProgress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${sendProgress}%` }}></div>
                  </div>
                  <div className="sending-log-list" style={{ maxHeight: '120px' }}>
                    {sendLogs.map((log, index) => (
                      <div key={index} className={`sending-log-item ${
                        log.includes('✅') ? 'sent' : log.includes('❌') ? 'failed' : 'sending'
                      }`}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button 
                  className={`btn btn-primary ${toEmails.length === 0 ? 'btn-disabled' : ''}`}
                  style={{ marginTop: '1rem' }}
                  onClick={handleSendCampaign}
                  disabled={toEmails.length === 0}
                >
                  <Send size={16} /> Dispatch to {toEmails.length} "To" Contact(s)
                </button>
              )}
            </div>
          </div>

          {/* RIGHT WING: AUDIENCE LIST AND SENDER TARGETS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* NEW BANK CONTACT SELECTOR */}
            <div className="glass-panel widget-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} className="color-primary" />
                  Select Target Branch Contacts
                </span>
              </h3>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem' }}>1. Select Bank</label>
                  <select 
                    className="form-control"
                    value={activeBankSelect}
                    onChange={(e) => {
                      setActiveBankSelect(e.target.value);
                      setActiveCenterSelect('');
                      setToEmails([]);
                      setCcEmails([]);
                    }}
                  >
                    <option value="">-- Choose a Bank --</option>
                    {Object.keys(banksData).sort().map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                
                {activeBankSelect && (
                  <div style={{ flex: 1, animation: 'fadeIn 0.2s ease-out' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem' }}>2. Select Branch Center</label>
                    <select 
                      className="form-control"
                      value={activeCenterSelect}
                      onChange={(e) => {
                        setActiveCenterSelect(e.target.value);
                        setToEmails([]);
                        setCcEmails([]);
                      }}
                    >
                      <option value="">-- All Branches --</option>
                      {Object.keys(banksData[activeBankSelect] || {}).sort().map(center => (
                        <option key={center} value={center}>{center}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* MANUAL EMAIL ADDITION */}
              <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Custom / Manual Addition</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="email" 
                    className="form-control btn-sm" 
                    placeholder="Enter email address..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newEmail && newEmail.includes('@')) {
                          setToEmails(prev => [...new Set([...prev, newEmail.trim()])]);
                          setNewEmail('');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => {
                      if (newEmail && newEmail.includes('@')) {
                        setToEmails(prev => [...new Set([...prev, newEmail.trim()])]);
                        setCcEmails(prev => prev.filter(e => e !== newEmail.trim()));
                        setNewEmail('');
                      }
                    }}
                  >
                    + Add to "To"
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => {
                      if (newEmail && newEmail.includes('@')) {
                        setCcEmails(prev => [...new Set([...prev, newEmail.trim()])]);
                        setToEmails(prev => prev.filter(e => e !== newEmail.trim()));
                        setNewEmail('');
                      }
                    }}
                  >
                    + Add to "CC"
                  </button>
                </div>
              </div>

              {activeBankSelect && (
                <div className="table-container" style={{ flex: '1 1 auto', overflowY: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Contacts for {activeBankSelect} {activeCenterSelect ? `- ${activeCenterSelect}` : '- All Branches'}
                  </h4>
                  <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '60px', textAlign: 'center' }}>To</th>
                        <th style={{ width: '60px', textAlign: 'center' }}>CC</th>
                        <th>Branch</th>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeCenterSelect ? 
                          banksData[activeBankSelect][activeCenterSelect].map(c => ({...c, branch: activeCenterSelect})) :
                          Object.keys(banksData[activeBankSelect]).flatMap(center => 
                            banksData[activeBankSelect][center].map(c => ({...c, branch: center}))
                          )
                      ).map((contact, i) => (
                        <tr key={i} style={{ backgroundColor: (toEmails.includes(contact.email) || ccEmails.includes(contact.email)) ? 'rgba(99,102,241,0.03)' : '' }}>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              className="checkbox-input"
                              checked={toEmails.includes(contact.email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setToEmails(prev => [...prev, contact.email]);
                                  setCcEmails(prev => prev.filter(c => c !== contact.email));
                                } else {
                                  setToEmails(prev => prev.filter(c => c !== contact.email));
                                }
                              }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              className="checkbox-input"
                              checked={ccEmails.includes(contact.email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCcEmails(prev => [...prev, contact.email]);
                                  setToEmails(prev => prev.filter(c => c !== contact.email));
                                } else {
                                  setCcEmails(prev => prev.filter(c => c !== contact.email));
                                }
                              }}
                            />
                          </td>
                          <td style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{contact.branch}</td>
                          <td style={{ fontWeight: 600 }}>{contact.name}</td>
                          <td>{contact.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ALWAYS VISIBLE SUMMARY BOX */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                  <div style={{ marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>Selected "To":</strong> 
                    {toEmails.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {toEmails.map(e => (
                          <span key={`to-${e}`} style={{ background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {e} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setToEmails(prev => prev.filter(m => m !== e))} />
                          </span>
                        ))}
                      </div>
                    ) : ' None'}
                  </div>
                  <div style={{ color: 'var(--text-primary)', marginTop: '0.75rem' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>Selected "CC":</strong> 
                    {ccEmails.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {ccEmails.map(e => (
                          <span key={`cc-${e}`} style={{ background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {e} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setCcEmails(prev => prev.filter(m => m !== e))} />
                          </span>
                        ))}
                      </div>
                    ) : ' None'}
                    <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>+ credanceforex@gmail.com (always copied)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEND OUTCOME LOGS */}
            <div className="glass-panel widget-card" style={{ maxHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div className="widget-title" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <span>Delivery Logs History</span>
                <span className="badge badge-sent" style={{ fontSize: '0.65rem' }}>
                  {history.filter(h => h.status === 'sent').length} sent
                </span>
              </div>
              
              <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                {history.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem', textAlignment: 'center' }}>
                    No delivery outcomes recorded yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {history.slice(0, 8).map((log, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        fontSize: '0.8rem', 
                        background: 'rgba(255,255,255,0.01)', 
                        padding: '0.35rem 0.5rem', 
                        borderRadius: '4px' 
                      }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <span style={{ fontWeight: 600 }}>{log.recipientEmail}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({log.subject})</span>
                          </div>
                          {log.status === 'failed' && log.error && (
                            <div style={{ color: 'var(--color-danger)', fontSize: '0.7rem', marginTop: '0.2rem', whiteSpace: 'normal', lineHeight: '1.2' }}>
                              <AlertCircle size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              {log.error}
                            </div>
                          )}
                        </div>
                        <span className={`badge badge-${log.status}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', alignSelf: 'flex-start' }}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
