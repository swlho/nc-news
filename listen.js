const app = require(`${__dirname}/app.js`)
const { PORT = 9090 } = process.env

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Listening on port 9090!');
    }
})