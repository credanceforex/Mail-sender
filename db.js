import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const defaultData = {
  recipients: [
    { id: '1', name: 'Alice Smith', email: 'alice.smith@example.com', company: 'Acme Corp', tags: ['Enterprise', 'Lead'], createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: '2', name: 'Bob Johnson', email: 'bob.johnson@example.com', company: 'Globex Corp', tags: ['Mid-Market', 'Follow-up'], createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
    { id: '3', name: 'Carol Williams', email: 'carol.williams@example.com', company: 'Initech Systems', tags: ['SMB', 'Cold'], createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: '4', name: 'David Brown', email: 'david.brown@example.com', company: 'Umbrella Corp', tags: ['Enterprise', 'Active'], createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: '5', name: 'Eva Davis', email: 'eva.davis@example.com', company: 'Hooli Inc', tags: ['Partner'], createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() }
  ],
  templates: [
    {
      id: '1',
      name: 'Product Demo Follow-up',
      subject: 'Quick follow-up regarding our product demo',
      body: 'Hi {name},\n\nIt was great speaking with you today about how we can help {company} automate your workflow. I wanted to follow up and see if you had any questions regarding the pricing plans we discussed.\n\nLooking forward to hearing from you!\n\nBest regards,\nAnshul',
      createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()
    },
    {
      id: '2',
      name: 'Monthly Product Newsletter',
      subject: 'Exciting updates for {company} in May!',
      body: 'Hi {name},\n\nWe\'re thrilled to share our latest product updates with the team at {company}.\n\nThis month, we\'ve launched our fully automated email sender! No more copy-pasting, no more manual mistakes. You can now send personalized bulk emails in seconds.\n\nLet us know if you would like a guided tour of the new features.\n\nCheers,\nAnshul',
      createdAt: new Date(Date.now() - 9*24*60*60*1000).toISOString()
    },
    {
      id: '3',
      name: 'Invoice Reminder',
      subject: 'Friendly Reminder: Outstanding invoice for {company}',
      body: 'Hi {name},\n\nHope you\'re doing well. This is a friendly reminder that the outstanding invoice for {company} is due next week. Please let me know if you have any questions or need us to resend the secure payment link.\n\nThank you for your business!\n\nBest regards,\nAnshul',
      createdAt: new Date(Date.now() - 8*24*60*60*1000).toISOString()
    }
  ],
  settings: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: 'your-email@gmail.com',
    pass: '',
    senderName: 'Anshul Somani',
    senderEmail: 'your-email@gmail.com',
    simulatedMode: true
  },
  history: [
    {
      id: 'h1',
      recipientName: 'Alice Smith',
      recipientEmail: 'alice.smith@example.com',
      subject: 'Quick follow-up regarding our product demo',
      body: 'Hi Alice Smith,\n\nIt was great speaking with you today about how we can help Acme Corp automate your workflow. I wanted to follow up and see if you had any questions regarding the pricing plans we discussed.\n\nLooking forward to hearing from you!\n\nBest regards,\nAnshul',
      sentAt: new Date(Date.now() - 2*3600*1000).toISOString(),
      status: 'sent',
      mode: 'Simulated'
    },
    {
      id: 'h2',
      recipientName: 'Bob Johnson',
      recipientEmail: 'bob.johnson@example.com',
      subject: 'Friendly Reminder: Outstanding invoice for Globex Corp',
      body: 'Hi Bob Johnson,\n\nHope you\'re doing well. This is a friendly reminder that the outstanding invoice for Globex Corp is due next week. Please let me know if you have any questions or need us to resend the secure payment link.\n\nThank you for your business!\n\nBest regards,\nAnshul',
      sentAt: new Date(Date.now() - 1*3600*1000).toISOString(),
      status: 'sent',
      mode: 'Simulated'
    }
  ]
};

// Ensure DB file exists
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}

// Read database
export function readDB() {
  initDB();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading database file:', error);
    return defaultData;
  }
}

// Write database
export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database file:', error);
    return false;
  }
}
