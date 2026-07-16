require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/user.model');

const PORT = process.env.PORT || 5000;

/**
 * Seed database with the mandatory admin user if not present.
 */
const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@fasterq.in';
    const adminPassword = 'admin123';

    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword // Will be hashed via pre-save Mongoose hook
      });
      await adminUser.save();
      console.log(`[Seeding]: Success! Seeded default admin account: ${adminEmail}`);
    } else {
      console.log(`[Seeding]: Default admin account already exists in database.`);
    }
  } catch (error) {
    console.error(`[Seeding Error]: Failed to verify/seed admin account: ${error.message}`);
  }
};

/**
 * Connect to DB, seed, and listen on port.
 */
const startServer = async () => {
  // 1. Establish database connection
  await connectDB();

  // 2. Run background seeding
  await seedAdminUser();

  // 3. Bind server to port
  const server = app.listen(PORT, () => {
    console.log(`[Server]: Listening on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled RejectionError]: ${err.message}`);
    // Graceful shutdown
    server.close(() => process.exit(1));
  });
};

startServer();
