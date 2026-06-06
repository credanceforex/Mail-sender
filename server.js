import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Send Email Utility (Nodemailer vs Simulation)
async function sendEmailUtil(to, subject, body, settings) {
  if (settings.simulatedMode) {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!to || !to.includes('@') || to.endsWith('@example.com') && Math.random() < 0.05) {
      return { success: false, error: 'Simulated connection failure: Host unreachable' };
    }
    return { success: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host || 'smtp.gmail.com',
      port: parseInt(settings.port) || 465,
      secure: settings.secure,
      auth: { user: settings.user, pass: settings.pass },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `"${settings.senderName || 'Sender'}" <${settings.senderEmail || settings.user}>`,
      to,
      cc: 'credanceforex@gmail.com',
      subject,
      text: body,
      html: `<div>${body.replace(/\n/g, '<br>')}</div>`
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP Error:', error);
    return { success: false, error: error.message || 'Unknown SMTP error occurred' };
  }
}

// Ensure settings exist
async function getSettings() {
  return await prisma.setting.upsert({
    where: { id: "1" },
    update: {},
    create: { id: "1" }
  });
}

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// --- RECIPIENTS ---
app.get('/api/recipients', async (req, res) => {
  const recipients = await prisma.recipient.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(recipients.map(r => ({ ...r, tags: r.tags ? JSON.parse(r.tags) : [] })));
});

app.post('/api/recipients', async (req, res) => {
  const list = Array.isArray(req.body) ? req.body : [req.body];
  const newRecipients = [];

  for (const item of list) {
    const { name, email, company, tags } = item;
    if (!email) continue;
    
    const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : (tags ? JSON.stringify(tags.split(',').map(t => t.trim())) : "[]");
    
    const recipient = await prisma.recipient.upsert({
      where: { email: email.toLowerCase() },
      update: { name: name || email.split('@')[0], company: company || 'Individual', tags: tagsStr },
      create: { name: name || email.split('@')[0], email: email.toLowerCase(), company: company || 'Individual', tags: tagsStr }
    });
    newRecipients.push({ ...recipient, tags: JSON.parse(recipient.tags) });
  }

  res.json({ success: true, count: newRecipients.length, recipients: newRecipients });
});

app.put('/api/recipients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, company, tags } = req.body;
  
  try {
    const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : (tags ? JSON.stringify(tags.split(',').map(t => t.trim())) : undefined);
    const recipient = await prisma.recipient.update({
      where: { id },
      data: { name, email: email?.toLowerCase(), company, ...(tagsStr !== undefined && { tags: tagsStr }) }
    });
    res.json({ success: true, recipient: { ...recipient, tags: recipient.tags ? JSON.parse(recipient.tags) : [] } });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Recipient not found' });
  }
});

app.delete('/api/recipients/:id', async (req, res) => {
  try {
    await prisma.recipient.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Recipient not found' });
  }
});


// --- TEMPLATES ---
app.get('/api/templates', async (req, res) => {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(templates);
});

app.post('/api/templates', async (req, res) => {
  const { name, subject, body } = req.body;
  if (!name || !subject || !body) return res.status(400).json({ success: false, error: 'Name, subject, and body are required' });

  const template = await prisma.template.create({ data: { name, subject, body } });
  res.json({ success: true, template });
});

app.put('/api/templates/:id', async (req, res) => {
  try {
    const template = await prisma.template.update({
      where: { id: req.params.id },
      data: { name: req.body.name, subject: req.body.subject, body: req.body.body }
    });
    res.json({ success: true, template });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Template not found' });
  }
});

app.delete('/api/templates/:id', async (req, res) => {
  try {
    await prisma.template.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Template not found' });
  }
});


// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
});

app.post('/api/settings', async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    if (dataToUpdate.port !== undefined) {
      dataToUpdate.port = String(dataToUpdate.port);
    }
    const settings = await prisma.setting.update({
      where: { id: "1" },
      data: dataToUpdate
    });
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// --- NEW GROUP EMAIL SENDER ---
app.post('/api/send_group', async (req, res) => {
  const settings = await getSettings();
  const { customSubject, customBody, toEmails, ccEmails } = req.body;

  if (!toEmails || !Array.isArray(toEmails) || toEmails.length === 0) {
    return res.status(400).json({ success: false, error: 'No TO recipients selected' });
  }
  if (!customSubject || !customBody) {
    return res.status(400).json({ success: false, error: 'Subject and body are required' });
  }

  const toStr = toEmails.join(', ');
  const ccStr = ccEmails ? ccEmails.join(', ') : '';
  const batchId = Math.random().toString(36).substr(2, 9);
  
  // Log pre-send
  let logEntry = await prisma.historyLog.create({
    data: {
      batchId,
      recipientName: "Bulk Contacts (BCC)",
      recipientEmail: toStr,
      subject: customSubject,
      body: customBody,
      mode: settings.simulatedMode ? 'Simulated' : 'SMTP',
      status: 'sending'
    }
  });
  
  let result = { success: false };
  
  if (settings.simulatedMode) {
    await new Promise(resolve => setTimeout(resolve, 800));
    result = { success: true };
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host: settings.host || 'smtp.gmail.com',
        port: parseInt(settings.port) || 465,
        secure: settings.secure,
        auth: { user: settings.user, pass: settings.pass },
        tls: { rejectUnauthorized: false }
      });

      const mailOptions = {
        from: `"${settings.senderName || 'Sender'}" <${settings.senderEmail || settings.user}>`,
        to: settings.senderEmail || settings.user, // Send to self as anchor
        bcc: toStr, // Blind CC all recipients for privacy
        cc: ccStr ? `credanceforex@gmail.com, ${ccStr}` : 'credanceforex@gmail.com',
        subject: customSubject,
        text: customBody,
        html: `<div>${customBody.replace(/\n/g, '<br>')}</div>`
      };

      const info = await transporter.sendMail(mailOptions);
      result = { success: true, messageId: info.messageId };
    } catch (error) {
      result = { success: false, error: error.message };
    }
  }

  // Update log
  logEntry = await prisma.historyLog.update({
    where: { id: logEntry.id },
    data: {
      status: result.success ? 'sent' : 'failed',
      sentAt: new Date(),
      error: result.success ? null : result.error
    }
  });

  res.json({ success: true, count: toEmails.length, results: [logEntry] });
});

// --- HISTORY LOGS ---
app.get('/api/history', async (req, res) => {
  const history = await prisma.historyLog.findMany({ orderBy: { sentAt: 'desc' } });
  res.json(history);
});

app.post('/api/history/clear', async (req, res) => {
  await prisma.historyLog.deleteMany();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, async () => {
  await getSettings(); // Init settings
  console.log(`[Express] Core services online at http://localhost:${PORT}`);
});
