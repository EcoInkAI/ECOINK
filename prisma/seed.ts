import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const adminEmail = 'admin@magricabinets.com.au';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: 'admin123', // In a real app, use hashing!
        role: 'ADMIN',
      },
    });
    console.log('Admin user created.');
  }

  // Import data dynamically (since we are running this with tsx)
  // We'll use require or relative path
  const dataPath = path.join(__dirname, '../data/index.ts');
  // Since we are using tsx, we can try to import directly if possible, 
  // but let's just define the data here for simplicity and to avoid import issues in seed
  
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Why Magri", href: "/why-magri-cabinets" },
    { label: "Bathroom", href: "/bathroom-vanities" },
    { label: "Kitchen", href: "/kitchen-cabinets" },
    { label: "Laundry", href: "/laundry-cabinets" },
    { label: "TV", href: "/tv-cabinets" },
    { label: "Wardrobes", href: "/wardrobes" },
    { label: "Furniture", href: "/furniture" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  const services = [
    {
      id: "bathroom-vanities",
      title: "Bathroom Vanities",
      description: "Custom-designed bathroom vanities that combine functionality with stunning aesthetics. Transform your bathroom into a luxurious retreat.",
      href: "/bathroom-vanities",
      iconName: "Bath",
    },
    {
      id: "furniture",
      title: "Custom Furniture",
      description: "Unique, handcrafted furniture pieces designed to your exact specifications. From dining tables to office desks.",
      href: "/furniture",
      iconName: "Armchair",
    },
    {
      id: "kitchen-cabinets",
      title: "Kitchen Cabinets",
      description: "Bespoke kitchen cabinetry tailored to your space and lifestyle. Experience the heart of your home with premium craftsmanship.",
      href: "/kitchen-cabinets",
      iconName: "ChefHat",
    },
    {
      id: "laundry-cabinets",
      title: "Laundry Cabinets",
      description: "Efficient and stylish laundry solutions that maximize storage and functionality. Make laundry day a breeze.",
      href: "/laundry-cabinets",
      iconName: "Shirt",
    },
    {
      id: "tv-cabinets",
      title: "TV Cabinets",
      description: "Custom entertainment units designed to showcase your technology while keeping cables organized and hidden.",
      href: "/tv-cabinets",
      iconName: "Tv",
    },
    {
      id: "wardrobes",
      title: "Wardrobes",
      description: "Walk-in and built-in wardrobes with smart storage solutions. Organize your wardrobe with custom-fitted interiors.",
      href: "/wardrobes",
      iconName: "Shirt",
    },
  ];

  const testimonials = [
    {
      id: "testimonial-1",
      quote: "Mark was very accommodating and professional throughout the entire process. The quality of the kitchen cabinets exceeded our expectations. Truly a premium experience!",
      author: "Sarah Mitchell",
      role: "Kitchen Renovation",
      rating: 5,
      image: "/sarah.png",
    },
    {
      id: "testimonial-2",
      quote: "Excellent workmanship and attention to detail on our laundry cabinets. They maximized our small space perfectly. Highly recommended for any custom joinery!",
      author: "Joe D'Agostino",
      role: "Laundry Upgrade",
      rating: 5,
      image: "/joe.png",
    },
    {
      id: "testimonial-3",
      quote: "Highly recommend Magri Cabinets for custom cabinetry in Melbourne. Their team is professional, clean, and the final finish is absolutely flawless.",
      author: "Michael Thompson",
      role: "Bathroom Vanity",
      rating: 5,
      image: "/michael.png",
    },
  ];

  const faqItems = [
    {
      id: "faq-1",
      question: "Do you come and measure and provide a free quote?",
      answer: "Yes, we can travel anywhere in Melbourne to measure and provide you a free no obligation quote",
    },
    {
      id: "faq-2",
      question: "Do you service the entire Melbourne area?",
      answer: "Yes, we can travel anywhere in Melbourne to measure and provide you a quote and also supply and install.",
    },
  ];

  const projects = [
    {
      id: "modern-kitchen-renovation",
      title: "Modern Kitchen Renovation",
      location: "Melbourne CBD",
      image: "/kitchen/IMG_3226.jpg",
      description: "Complete kitchen transformation with custom cabinetry, stone benchtops, and modern fixtures.",
    },
    {
      id: "luxury-master-wardrobe",
      title: "Luxury Master Wardrobe",
      location: "Toorak",
      image: "/wardrobe/wardrobe-1.png",
      description: "Walk-in wardrobe with custom shelving, LED lighting, and velvet-lined drawers.",
    },
  ];

  // 2. Insert Services
  console.log('Inserting services...');
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.id },
      update: {},
      create: {
        name: service.title,
        slug: service.id,
        description: service.description,
        icon: service.iconName,
        isVisible: true,
      },
    });
  }

  // 3. Insert Testimonials
  console.log('Inserting testimonials...');
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        clientName: testimonial.author,
        role: testimonial.role,
        content: testimonial.quote,
        rating: testimonial.rating,
        avatarUrl: testimonial.image,
        isVisible: true,
      },
    });
  }

  // 4. Insert FAQs
  console.log('Inserting FAQs...');
  for (const faq of faqItems) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        isVisible: true,
      },
    });
  }

  // 5. Insert Projects
  console.log('Inserting projects...');
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.id },
      update: {},
      create: {
        title: project.title,
        slug: project.id,
        description: project.description,
        location: project.location,
        thumbnailImage: project.image,
        isVisible: true,
      },
    });
  }

  // 6. Insert Blog Posts (from Markdown files)
  console.log('Inserting blog posts...');
  const blogFiles = ['Blog1.md', 'Blog2.md', 'Blog3.md', 'Blog4.md', 'Blog5.md', 'Blog6.md'];
  
  for (const file of blogFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const title = lines[0].replace('# ', '').trim();
      const slug = file.replace('.md', '').toLowerCase();
      
      await prisma.blogPost.upsert({
        where: { slug },
        update: {},
        create: {
          title: title,
          slug: slug,
          content: content,
          excerpt: lines.slice(2, 5).join(' ').substring(0, 160) + '...',
          isPublished: true,
          publishedAt: new Date(),
        },
      });
    }
  }

  // 7. Insert Menu Items
  console.log('Inserting menu items...');
  for (let i = 0; i < navigationItems.length; i++) {
    const item = navigationItems[i];
    await prisma.menuItem.create({
      data: {
        label: item.label,
        link: item.href,
        order: i,
        isVisible: true,
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
