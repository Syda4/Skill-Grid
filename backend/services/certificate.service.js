const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generates a Digital Certificate PDF with an embedded QR Code.
 * @param {Object} certificateData - Certificate details.
 * @returns {Promise<string>} Path to the saved PDF file.
 */
const generateCertificatePDF = async ({ certificateId, candidateName, assessmentTitle, score, issueDate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
      
      const storageDir = path.join(__dirname, '../uploads/certificates');
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }

      const filePath = path.join(storageDir, `${certificateId}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Public verification URL encoded in QR Code
      const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${certificateId}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl);

      // Certificate Border & Design
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1D4ED8');
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#93C5FD');

      // Title Header
      doc.fillColor('#1E3A8A')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('SKILL-GRID CERTIFICATE OF ACHIEVEMENT', 0, 80, { align: 'center' });

      doc.fillColor('#4B5563')
         .fontSize(16)
         .font('Helvetica')
         .text('This is proudly presented to', 0, 140, { align: 'center' });

      // Candidate Name
      doc.fillColor('#000000')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text(candidateName.toUpperCase(), 0, 180, { align: 'center' });

      // Assessment Info
      doc.fillColor('#4B5563')
         .fontSize(16)
         .font('Helvetica')
         .text(`for successfully clearing the assessment:`, 0, 230, { align: 'center' });

      doc.fillColor('#1D4ED8')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text(assessmentTitle, 0, 260, { align: 'center' });

      doc.fillColor('#374151')
         .fontSize(14)
         .font('Helvetica')
         .text(`Score Obtained: ${score}%  |  Date of Issue: ${new Date(issueDate).toLocaleDateString()}`, 0, 310, { align: 'center' });

      // Embed QR Code
      const qrImageBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
      doc.image(qrImageBuffer, doc.page.width - 150, doc.page.height - 160, { width: 90, height: 90 });

      // Verification Details
      doc.fillColor('#6B7280')
         .fontSize(10)
         .font('Helvetica')
         .text(`Certificate ID: ${certificateId}`, 50, doc.page.height - 110)
         .text(`Scan QR code or visit platform to verify authenticity.`, 50, doc.page.height - 95);

      doc.end();

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateCertificatePDF };