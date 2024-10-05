const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        const jsonArray = await csv({ delimiter: '\t' }).fromFile(filePath);

        const formattedData = jsonArray.map(record => ({
            user_id: parseInt(record.user_id, 10),
            session_id: parseInt(record.session_id, 10),
            is_authenticated: parseInt(record.is_authenticated, 10),  
            usage_history: [
                {
                    timestamp: record.timestamp,
                    app_name: record.app_name,
                    event_type: record.event_type
                }
            ]
        }));

        res.status(200).json({ msg: 'File processed successfully', data: formattedData });

        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).json({ msg: 'Error processing file', error: error.message });
    }
});

module.exports = router;
