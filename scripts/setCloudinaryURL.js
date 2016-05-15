const fs = require('fs');

module.exports = () => {
    if (!process.env.CLOUDINARY_URL) {
        process.env.CLOUDINARY_URL =
            fs.readFileSync('./config/cloudinary.txt', 'utf-8').match(/='(.*)'/)[1];
    }
};
