import PDFDocument from 'pdfkit';
import { supabaseAdmin } from '../lib/supabase.js';

  const generatePdfBuffer = (title, markdownContent) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const buffers = []

    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end',  () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' })
    doc.moveDown()
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
    doc.moveDown()

    const lines = markdownContent.split('\n')
    let inCodeBlock = false

    for (const line of lines) {
      // Toggle code block
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }

      // Di dalam code block
      if (inCodeBlock) {
        doc.fontSize(10).font('Courier')
           .text(line || ' ', { indent: 20 })
        continue
      }

      // Strip semua markdown formatting dari teks biasa
      const clean = line
        .replace(/\*\*(.+?)\*\*/g, '$1')  // **bold** → bold
        .replace(/\*(.+?)\*/g, '$1')       // *italic* → italic
        .replace(/`(.+?)`/g, '$1')         // `code` → code
        .replace(/\$\$?.+?\$\$?/g, '[formula]') // $$latex$$ → [formula]
        .replace(/#{1,6} /, '')            // # heading → hapus #
        .trim()

      if (!clean) {
        doc.moveDown(0.3)
        continue
      }

      if (line.startsWith('# ')) {
        doc.moveDown(0.5)
        doc.fontSize(20).font('Helvetica-Bold').text(clean)
        doc.moveDown(0.3)
      } else if (line.startsWith('## ')) {
        doc.moveDown(0.5)
        doc.fontSize(16).font('Helvetica-Bold').text(clean)
        doc.moveDown(0.3)
      } else if (line.startsWith('### ')) {
        doc.moveDown(0.3)
        doc.fontSize(13).font('Helvetica-Bold').text(clean)
        doc.moveDown(0.2)
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.replace(/^[-*] /, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
        doc.fontSize(11).font('Helvetica')
           .text('• ' + bulletText.trim(), { indent: 20 })
      } else if (line.match(/^\d+\.\s/)) {
        // numbered list
        const numText = line.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, '$1')
        doc.fontSize(11).font('Helvetica')
           .text(line.match(/^\d+/)[0] + '. ' + numText.trim(), { indent: 20 })
      } else {
        doc.fontSize(11).font('Helvetica').text(clean, { align: 'justify' })
      }
    }

    doc.end()
  })

  }



export const generateAndUploadPdf = async (checkpointId, title , markdownContent) => { 
    const pdfBuffer = await generatePdfBuffer(title,markdownContent)

    const fileName = `checkpoints/${checkpointId}.pdf`
    const { error } = await supabaseAdmin.storage
      .from('materials')
      .upload(fileName, pdfBuffer, {
        contentType : 'application/pdf',
        upsert: true,
      })


    if(error) throw error (`Error uploading PDF: ${error.message}`)

    const { data } = supabaseAdmin.storage
      .from('materials')
      .getPublicUrl(fileName)
    return data.publicUrl
}
            
     