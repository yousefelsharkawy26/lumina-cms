import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

const seed = async () => {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.storeSettings.deleteMany();

    console.log("Seeding initial data...");

    // Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@lumina.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    const standardUser = await prisma.user.create({
      data: {
        name: "Test Customer",
        email: "customer@test.com",
        password: userPassword,
        role: "USER",
      },
    });

    const standardUser2 = await prisma.user.create({
      data: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: userPassword,
        role: "USER",
      },
    });

    // Store Settings
    await prisma.storeSettings.create({
      data: {
        id: "default",
        storeName: "Lumina Premium",
        supportEmail: "support@lumina.com",
        currency: "USD ($)",
        taxRate: 0.08,
      },
    });

    // Categories
    const electronics = await prisma.category.create({
      data: { name: "Electronics" },
    });
    const audio = await prisma.category.create({ data: { name: "Audio" } });
    const smartHome = await prisma.category.create({
      data: { name: "Smart Home" },
    });
    const accessories = await prisma.category.create({
      data: { name: "Accessories" },
    });
    const wearables = await prisma.category.create({
      data: { name: "Wearables" },
    });

    // Products
    const productsData = [
      // Audio
      {
        name: "Lumina Pro Wireless ANC Earbuds",
        description:
          "Industry-leading noise cancellation, crystal clear sound, and an ergonomic fit that feels practically weightless. Up to 24 hours of total listening time.",
        price: 199.99,
        imageUrl:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
        stockCount: 45,
        categoryId: audio.id,
      },
      {
        name: "Acoustic Over-Ear Studio Headphones",
        description:
          "High-fidelity audio meets unparalleled comfort. Featuring custom 50mm dynamic drivers and an ultra-soft premium leather headband.",
        price: 349.0,
        imageUrl:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
        stockCount: 15,
        categoryId: audio.id,
      },
      {
        name: "Voyager Portable Bluetooth Speaker",
        description:
          "Waterproof, rugged, and sounds spectacular. Brings massive stereo sound to the beach, mountains, or your living room.",
        price: 129.5,
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
        stockCount: 60,
        categoryId: audio.id,
      },
      {
        name: "Soundbar X-Fi Surround System",
        description:
          "Transform your TV into a home theater. Wireless subwoofer and Dolby Atmos support provide immersive, room-filling sound.",
        price: 499.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
        stockCount: 5,
        categoryId: audio.id,
      },

      // Electronics
      {
        name: 'Nova 32" 4K Curved Monitor',
        description:
          "Immerse yourself with a stunning 4K curved display. 144Hz refresh rate, 1ms response time, and 99% sRGB color accuracy for professionals and gamers alike.",
        price: 649.0,
        imageUrl:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
        stockCount: 12,
        categoryId: electronics.id,
      },
      {
        name: "Mechanical V2 Tactile Keyboard",
        description:
          "Premium aluminum chassis with hot-swappable tactile switches, per-key RGB backlighting, and a satisfying acoustic dampening layout.",
        price: 159.5,
        imageUrl:
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
        stockCount: 20,
        categoryId: electronics.id,
      },
      {
        name: 'Slate Tablet Pro 12" 256GB',
        description:
          "Incredibly thin, fast, and feature-rich. Perfect for digital art, taking notes, or unwinding with a movie. Pen accessory included.",
        price: 799.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
        stockCount: 30,
        categoryId: electronics.id,
      },
      {
        name: "ErgoMouse Wireless MX",
        description:
          "Advanced ergonomic design reduces wrist strain during those long work sessions. Up to 70 days of battery life on a single charge.",
        price: 89.99,
        imageUrl:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
        stockCount: 40,
        categoryId: electronics.id,
      },

      // Smart Home
      {
        name: "Aura Smart LED Bulb (Color)",
        description:
          "Transform any room with exactly the right lighting. Choose from 16 million colors or tune from warm to cool white.",
        price: 29.99,
        imageUrl:
          "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop",
        stockCount: 150,
        categoryId: smartHome.id,
      },
      {
        name: "Thermostat Vision Pro",
        description:
          "Learns your habits and precisely controls your climate to save energy and keep you perfectly comfortable.",
        price: 249.0,
        imageUrl:
          "https://images.unsplash.com/photo-1563837738676-e9102ca142ce?q=80&w=800&auto=format&fit=crop",
        stockCount: 8,
        categoryId: smartHome.id,
      },
      {
        name: "Guardian Smart Doorbell Camera",
        description:
          "Advanced motion detection, 1080p HD video, and two-way audio. Keep an eye on your front door from anywhere in the world.",
        price: 189.99,
        imageUrl:
          "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        stockCount: 25,
        categoryId: smartHome.id,
      },

      // Accessories
      {
        name: "Premium Leather Laptop Sleeve",
        description:
          "Handcrafted full-grain leather sleeve designed to elegantly protect laptops up to 14 inches.",
        price: 85.0,
        imageUrl:
          "https://images.unsplash.com/photo-1601323334814-1e5f8f3c7ea5?q=80&w=800&auto=format&fit=crop",
        stockCount: 50,
        categoryId: accessories.id,
      },
      {
        name: "MagCharge Dual Wireless Pad",
        description:
          "Sleek, low-profile wireless charger capable of rapidly charging your phone and earbuds simultaneously.",
        price: 65.0,
        imageUrl:
          "https://images.unsplash.com/photo-1586618580556-32fcb943d043?q=80&w=800&auto=format&fit=crop",
        stockCount: 60,
        categoryId: accessories.id,
      },
      {
        name: "Nomad Tech Organizer Pouch",
        description:
          "Keep all your cables, dongles, and small accessories perfectly organized in this rugged, water-resistant pouch.",
        price: 45.0,
        imageUrl:
          "https://images.unsplash.com/photo-1555529771-835f59fc0b29?q=80&w=800&auto=format&fit=crop",
        stockCount: 80,
        categoryId: accessories.id,
      },

      // Wearables
      {
        name: "Apex Smartwatch Pro",
        description:
          "Track your fitness, monitor your heart rate, and receive notifications straight to your wrist. Premium titanium casing.",
        price: 399.0,
        imageUrl:
          "https://images.unsplash.com/photo-1434493789847-2f02b0c1e485?q=80&w=800&auto=format&fit=crop",
        stockCount: 18,
        categoryId: wearables.id,
      },
      {
        name: "Pulse Fitness Tracker",
        description:
          "Minimalist, lightweight tracker designed for athletes. Accurately measures steps, sleep, and intense workouts.",
        price: 129.0,
        imageUrl:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
        stockCount: 45,
        categoryId: wearables.id,
      },
    ];

    console.log("Creating products...");
    const createdProducts = [];
    for (const prod of productsData) {
      createdProducts.push(
        await prisma.product.create({
          data: prod,
        }),
      );
    }

    // Creating orders for standardUser
    console.log("Creating mock orders...");

    // Order 1: Delivered
    await prisma.order.create({
      data: {
        userId: standardUser.id,
        totalAmount: 284.99,
        status: "DELIVERED",
        createdAt: new Date("2023-11-15"),
        orderItems: {
          create: [
            {
              productId: createdProducts[0].id, // Lumina Pro Wireless ANC Earbuds (199.99)
              quantity: 1,
              price: 199.99,
            },
            {
              productId: createdProducts[11].id, // Premium Leather Laptop Sleeve (85.00)
              quantity: 1,
              price: 85.0,
            },
          ],
        },
      },
    });

    // Order 2: Shipped
    await prisma.order.create({
      data: {
        userId: standardUser.id,
        totalAmount: 649.0,
        status: "SHIPPED",
        createdAt: new Date("2023-12-05"),
        orderItems: {
          create: [
            {
              productId: createdProducts[4].id, // Nova 32" 4K Curved Monitor (649.00)
              quantity: 1,
              price: 649.0,
            },
          ],
        },
      },
    });

    // Order 3: Pending
    await prisma.order.create({
      data: {
        userId: standardUser.id,
        totalAmount: 89.97,
        status: "PENDING",
        createdAt: new Date(),
        orderItems: {
          create: [
            {
              productId: createdProducts[8].id, // Aura Smart LED Bulb (Color) (29.99)
              quantity: 3,
              price: 29.99,
            },
          ],
        },
      },
    });

    // Order 4: Cancelled (for standardUser2)
    await prisma.order.create({
      data: {
        userId: standardUser2.id,
        totalAmount: 399.0,
        status: "CANCELLED",
        createdAt: new Date("2023-12-10"),
        orderItems: {
          create: [
            {
              productId: createdProducts[14].id, // Apex Smartwatch Pro (399.0)
              quantity: 1,
              price: 399.0,
            },
          ],
        },
      },
    });

    // Order 5: Paid (for Admin User to check out)
    await prisma.order.create({
      data: {
        userId: adminUser.id,
        totalAmount: 349.0,
        status: "PAID",
        createdAt: new Date("2023-12-12"),
        orderItems: {
          create: [
            {
              productId: createdProducts[1].id, // Acoustic Over-Ear Studio Headphones
              quantity: 1,
              price: 349.0,
            },
          ],
        },
      },
    });

    // Add some realistic review data for the first product
    console.log("Adding reviews...");
    await prisma.review.createMany({
      data: [
        {
          rating: 5,
          comment:
            "Absolutely love these! The sound quality is incredible and they do not fall out during workouts.",
          productId: createdProducts[0].id,
          userId: standardUser.id,
        },
        {
          rating: 4,
          comment:
            "Great earbuds, but I wish the battery case was just a little bit smaller. Still a solid purchase.",
          productId: createdProducts[0].id,
          userId: adminUser.id,
        },
        {
          rating: 5,
          comment: "Game changer for working from home!",
          productId: createdProducts[4].id, // Monitor
          userId: standardUser.id,
        },
        {
          rating: 2,
          comment:
            "Color accuracy is great, but mine arrived with a small scratch on the bezel. Returning it.",
          productId: createdProducts[4].id, // Monitor
          userId: standardUser2.id,
        },
      ],
    });

    console.log(
      "✅ Seed completed successfully! Lots of varied products, users, and orders added.",
    );
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seed();
