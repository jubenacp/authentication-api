require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const db = require('./config/database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const notificationsRouter = require('./routes/notifications');
const mlModelRouter = require('./routes/mlmodel');
const uploadRouter = require('./routes/upload');
const usageHistoryRouter = require('./routes/usageHistory');
const userDevicesRouter = require('./routes/userDevices');
const userLocationsRouter = require('./routes/userLocations');
const userNetworksRouter = require('./routes/userNetworks');
const logsRouter = require('./routes/logs');
const modelVersionsRoutes = require('./routes/modelVersions');
const mlmodelRoutes = require('./routes/mlmodel');
const adminRouter = require('./routes/admin');

const authMiddleware = require('./middleware/authMiddleware');
const loggingMiddleware = require('./middleware/loggingMiddleware');

const swaggerSetup = require('./swagger');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(loggingMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/mlmodel', authMiddleware, mlModelRouter);
app.use('/api', uploadRouter);
app.use('/api/usage_history', usageHistoryRouter);
app.use('/api/user_devices', authMiddleware, userDevicesRouter);
app.use('/api/user_locations', authMiddleware, userLocationsRouter);
app.use('/api/user_networks', authMiddleware, userNetworksRouter);
app.use('/api/mlmodel', mlmodelRoutes);
app.use('/api/mlmodel/logs', logsRouter);
app.use('/api/mlmodel/models', modelVersionsRoutes);
app.use('/api/admin', adminRouter);

app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fs = require('fs');
    const readline = require('readline');
    const path = require('path');
    const filePath = path.join(__dirname, file.path);

    const tsvToJSON = async () => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const jsonResult = [];
        let headers = [];

        for await (const line of rl) {
            const columns = line.split('\t');
            if (!headers.length) {
                headers = columns;
            } else {
                const row = {};
                columns.forEach((col, index) => {
                    row[headers[index]] = col;
                });
                jsonResult.push(row);
            }
        }

        fs.unlinkSync(filePath); // Eliminar el archivo cargado después de procesarlo
        return jsonResult;
    };

    tsvToJSON().then(jsonData => {
        const adaptedData = {
            user_id: parseInt(jsonData[0].user_id),
            session_id: parseInt(jsonData[0].session_id),
            usage_history: jsonData.map(event => ({
                timestamp: event.timestamp,
                app_name: event.app_name,
                event_type: event.event_type
            }))
        };

        res.json(adaptedData);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ msg: 'Error processing file' });
    });
});

swaggerSetup(app);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

console.log('Aplicación Express configurada correctamente');
module.exports = app;
