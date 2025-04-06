require('dotenv').config(); // ✅ Load environment variables FIRST
console.log("✅ MONGODB_URI:", process.env.MONGODB_URI); // Debugging log

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/resolvers/resolver');
const authenticate = require('./src/middleware/auth');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined. Check your .env file.");
    process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Serve uploaded files statically
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    // File upload endpoint
    app.post('/upload', upload.single('image'), (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            
            // Create URL for the uploaded file
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
            res.json({
                url: fileUrl,
                filename: req.file.filename
            });
        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).json({ error: 'File upload failed' });
        }
    });

    // ✅ Connect to MongoDB Atlas
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('🚀 MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const user = authenticate(req);
            return { user };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
