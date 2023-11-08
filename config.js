exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb+srv://aurapinilla12:Kyra1234%23@cluster0.gxpuzxe.mongodb.net/';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'aura.pinilla12@gmail.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'bqadmin123';

