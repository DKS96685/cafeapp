import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const userPassword = await bcrypt.hash('user123', 10)

    await prisma.user.upsert({
        where: { email: 'admin@cafe.com' },
        update: {},
        create: {
            email: 'admin@cafe.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    await prisma.user.upsert({
        where: { email: 'user@cafe.com' },
        update: {},
        create: {
            email: 'user@cafe.com',
            name: 'Normal User',
            password: userPassword,
            role: 'USER',
        },
    })

    await prisma.menuItem.deleteMany()

    const menuItems = [
        { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes', price: 15.0, dayOfWeek: 'Monday', imageUrl: '/images/samosa_1773209182182.png' },
        { name: 'Samosa Chat', description: 'Crushed samosas topped with yogurt, chutneys and spices', price: 30.0, dayOfWeek: 'Tuesday', imageUrl: '/images/samosa_chat_1773209208271.png' },
        { name: 'Chicken Pakoda', description: 'Crispy fried chicken fritters', price: 60.0, dayOfWeek: 'Wednesday', imageUrl: '/images/chicken_pakoda_1773209225158.png' },
        { name: 'Paneer Pakoda', description: 'Soft paneer cubes in crispy besan batter', price: 50.0, dayOfWeek: 'Wednesday', imageUrl: '/images/paneer_pakoda_1773209242288.png' },
        { name: 'Breadchop', description: 'Spiced potato stuffed bread, deep fried', price: 20.0, dayOfWeek: 'Wednesday', imageUrl: '/images/breadchop_1773209274964.png' },
        { name: 'Dosa', description: 'Crispy savory crepe served with chutney and sambar', price: 50.0, dayOfWeek: 'Thursday', imageUrl: '/images/dosa_1773209299614.png' },
        { name: 'Chowmin', description: 'Stir-fried noodles with crisp vegetables and sauces', price: 45.0, dayOfWeek: 'Friday', imageUrl: '/images/chowmin_1773209317618.png' },
        { name: 'Manchuiriyan', description: 'Indo-Chinese style deep fried vegetable balls in spicy sauce', price: 55.0, dayOfWeek: 'Saturday', imageUrl: '/images/manchuiriyan_1773209332425.png' },
        { name: 'Tea', description: 'Freshly brewed hot tea', price: 10.0, dayOfWeek: 'Everyday', imageUrl: '/images/tea_1773209360490.png' },
        { name: 'Coffee', description: 'Freshly brewed hot coffee', price: 15.0, dayOfWeek: 'Everyday', imageUrl: '/images/coffee_1773209377595.png' },
        { name: 'Maggie', description: 'Hot bowl of Maggi noodles with vegetables', price: 30.0, dayOfWeek: 'Everyday', imageUrl: '/images/maggie_1773209967884.png' },
        { name: 'Ice Cream Cone', description: 'Rich ice cream served on a crispy waffle cone', price: 10.0, dayOfWeek: 'Everyday', imageUrl: '/images/ice_cream_cone_1773209985060.png' },
        { name: 'Ice Cream Cup', description: 'Delicious ice cream scoop served in a cup', price: 10.0, dayOfWeek: 'Everyday', imageUrl: '/images/ice_cream_cup_1773210003674.png' },
        { name: 'Ice Cream Stick', description: 'Chocolate-coated premium ice cream stick', price: 10.0, dayOfWeek: 'Everyday', imageUrl: '/images/ice_cream_stick_1773210018602.png' },
        { name: 'Coca Cola', description: 'Ice-cold Coca Cola. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/cococola_1773210034808.png' },
        { name: 'Pepsi', description: 'Refreshing Pepsi. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/cococola_1773210034808.png' },
        { name: 'Thumbs Up', description: 'Strong fizzy Thumbs Up. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/cococola_1773210034808.png' },
        { name: 'Limca', description: 'Cloudy lemon-lime Limca. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/soft_drinks_1773209411508.png' },
        { name: 'Tata Glucose', description: 'Energy packed Tata Glucose. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/soft_drinks_1773209411508.png' },
        { name: 'Fanta', description: 'Vibrant orange Fanta. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/soft_drinks_1773209411508.png' },
        { name: 'Maza', description: 'Thick mango Maza juice. Available in 250ml(₹20), 500ml(₹40), 1L(₹90)', price: 20.0, dayOfWeek: 'Everyday', imageUrl: '/images/soft_drinks_1773209411508.png' },
    ];

    for (const item of menuItems) {
        await prisma.menuItem.create({
            data: item,
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
