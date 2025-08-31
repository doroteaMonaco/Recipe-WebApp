import prisma from '../lib/prisma';

export const userService = {
    async findById(id){
        return await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        })
    },

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    async findforAuth(email) {
        return await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        })
    },

    async createUser(data){
        return await prisma.user.create({
            data: data,
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        })
    },

    async updateUser(id, data){
        return await prisma.user.update({
            where: {id},
            data: data,
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        })
    },

    async deleteUser(id){
        return await prisma.user.delete({
            where: {id}
        })
    },

    // Metodi aggiuntivi utili
    async findUserWithRecipes(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                recipes: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        imageUrl: true,
                        isPublished: true,
                        createdAt: true
                    },
                    where: { isPublished: true },
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        recipes: true,
                        comments: true,
                        reactions: true
                    }
                }
            }
        });
    },

    async searchUsers(query) {
        return await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true
            },
            take: 10
        });
    }
}