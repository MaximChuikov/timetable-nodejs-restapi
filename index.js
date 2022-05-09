const express = require('express')
const userRouter = require('./routes/user.routes')
const PORT = process.env.PORT || 8080

const app = express()

// Create express server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

app.use(express.json())
app.use('/api', userRouter)

app.listen(PORT, () => console.log('server started'))