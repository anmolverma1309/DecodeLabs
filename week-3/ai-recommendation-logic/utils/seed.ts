import { connect, disconnect } from 'mongoose';
import { User } from '../models/User';
import { Item } from '../models/Item';
import { Interaction } from '../models/Interaction';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const seedItems = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    category: 'Movie',
    tags: ['Sci-Fi', 'Action', 'Thriller', 'Mind-Bending'],
    rating: 8.8,
    popularityScore: 100,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    category: 'Movie',
    tags: ['Sci-Fi', 'Adventure', 'Drama', 'Space'],
    rating: 8.6,
    popularityScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    category: 'Movie',
    tags: ['Sci-Fi', 'Action', 'Cyberpunk'],
    rating: 8.7,
    popularityScore: 98,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'React - The Complete Guide',
    description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Next.js and way more!',
    category: 'Course',
    tags: ['Programming', 'Web Development', 'React', 'Frontend'],
    rating: 4.8,
    popularityScore: 90,
    difficultyLevel: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Advanced Node.js Concepts',
    description: 'A deep dive into Node.js, covering the event loop, streams, clusters, and asynchronous programming.',
    category: 'Course',
    tags: ['Programming', 'Backend', 'Node.js', 'Advanced'],
    rating: 4.9,
    popularityScore: 85,
    difficultyLevel: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Dune',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    category: 'Book',
    tags: ['Sci-Fi', 'Fantasy', 'Adventure', 'Classic'],
    rating: 4.7,
    popularityScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Pragmatic Programmer',
    description: 'From journeys to mastery, this book will help you become a better programmer.',
    category: 'Book',
    tags: ['Programming', 'Software Engineering', 'Classic', 'Career'],
    rating: 4.8,
    popularityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    category: 'Movie',
    tags: ['Action', 'Crime', 'Drama', 'Thriller'],
    rating: 9.0,
    popularityScore: 99,
    imageUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Clean Code',
    description: 'A Handbook of Agile Software Craftsmanship.',
    category: 'Book',
    tags: ['Programming', 'Software Engineering', 'Best Practices'],
    rating: 4.6,
    popularityScore: 80,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Machine Learning A-Z',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
    category: 'Course',
    tags: ['Programming', 'Data Science', 'Machine Learning', 'Python'],
    rating: 4.7,
    popularityScore: 94,
    difficultyLevel: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(MONGODB_URI as string);
    console.log('Connected.');

    console.log('Clearing existing data...');
    await Item.deleteMany({});
    await User.deleteMany({});
    await Interaction.deleteMany({});
    console.log('Cleared.');

    console.log('Seeding items...');
    await Item.insertMany(seedItems);
    console.log('Items seeded.');

    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('password', 10);
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      preferences: ['Sci-Fi', 'Programming'],
      role: 'USER',
    });
    console.log('Demo user created (demo@example.com / password).');

    console.log('Seeding interactions...');
    // Seed some initial interactions for the demo user
    const items = await Item.find({});
    
    // User likes Inception
    const inception = items.find(i => i.title === 'Inception');
    if (inception) {
      await Interaction.create({
        userId: demoUser._id,
        itemId: inception._id,
        type: 'LIKE',
        weight: 1.0,
      });
    }

    // User views React course
    const reactCourse = items.find(i => i.title === 'React - The Complete Guide');
    if (reactCourse) {
      await Interaction.create({
        userId: demoUser._id,
        itemId: reactCourse._id,
        type: 'VIEW',
        weight: 0.5,
      });
    }

    // User favorites The Pragmatic Programmer
    const pragmatic = items.find(i => i.title === 'The Pragmatic Programmer');
    if (pragmatic) {
      await Interaction.create({
        userId: demoUser._id,
        itemId: pragmatic._id,
        type: 'FAVORITE',
        weight: 2.0,
      });
    }

    console.log('Interactions seeded.');
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
