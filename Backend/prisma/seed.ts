import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        email: 'nguyenvana@prisma.io',
        name: 'Nguyen Van A',
        phone: '0908123456',
        password: 'password1',
    },
    {
        email: 'nguyenvanb@prisma.io',
        name: 'Nguyen Van B',
        phone: '0905123456',
        password: 'password2',
    }
]

async function main() {
    console.log("Start seeding...");
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id ${user.id}`);
    }
    console.log("Seeding finished.");
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })