import express from 'express';

// const message = 'hello world';
// console.log(message);

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

app.use('*', (req, res, next)=>{
    res.status(404).json({
        message: 'Route not found',
    });
    });

app.use((err, req, res, next)=>{
res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
});
});

app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

app.listen(PORT, ()=>{
console.log(`Server is running on port ${PORT}`);
});
