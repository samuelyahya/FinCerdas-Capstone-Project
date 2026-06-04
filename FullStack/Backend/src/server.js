const express = require('express');
const cors = require('cors');
require('dotenv').config();

const predictionRoutes = require('./routes/prediction.routes');
const authRoutes = require('./routes/auth.routes'); 
const userRoutes = require('./routes/user.routes');        
const analysesRoutes = require('./routes/analyses.routes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Fintech Cerdas Backend API is running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
  });
});

app.use('/api/auth', authRoutes);  
app.use('/api', predictionRoutes);
app.use('/api/user', userRoutes);         
app.use('/api/analyses', analysesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});