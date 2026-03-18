const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Job = require('./models/Job');

dotenv.config();

const DUMMY_JOBS = [
  {
    title: 'Software Engineer',
    company: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    location: 'San Francisco, USA',
    type: 'Full-time',
    salary: 95000,
    currency: 'USD',
    description: 'Develop and maintain web applications.',
    isBookMarked: true,
    experienceLevel: 'Mid Level',
  }
];

const seedData = async () => {
    try {
        await connectDB();
        await Job.deleteMany(); // Clear existing jobs
        await Job.insertMany(DUMMY_JOBS);
        console.log('Data Imported to MongoDB!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error.message}`);
        console.error('Make sure your MONGO_URI in .env is valid!');
        process.exit(1);
    }
}

seedData();
