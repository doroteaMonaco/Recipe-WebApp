import { prisma } from '../lib/prisma.js';

export const reactionService = {
    async findById(id) {
        return await prisma.reaction.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                recipe: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    },

    async createReaction(data) {
        return await prisma.reaction.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    },

    async deleteReaction(id) {
        return await prisma.reaction.delete({
            where: { id }
        });
    },

    async findReactionsByRecipe(recipeId) {
        return await prisma.reaction.findMany({
            where: { recipeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async findUserReactionOnRecipe(userId, recipeId) {
        return await prisma.reaction.findFirst({
            where: {
                userId,
                recipeId
            }
        });
    },

    async toggleReaction(userId, recipeId, type) {
        // Cerca se esiste già una reaction
        const existing = await this.findUserReactionOnRecipe(userId, recipeId);
        
        if (existing) {
            if (existing.type === type) {
                // Rimuovi la reaction se è la stessa
                return await this.deleteReaction(existing.id);
            } else {
                // Aggiorna il tipo di reaction
                return await prisma.reaction.update({
                    where: { id: existing.id },
                    data: { type },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                });
            }
        } else {
            // Crea nuova reaction
            return await this.createReaction({
                userId,
                recipeId,
                type
            });
        }
    },

    async getReactionStats(recipeId) {
        const reactions = await prisma.reaction.groupBy({
            by: ['type'],
            where: { recipeId },
            _count: {
                type: true
            }
        });

        return reactions.reduce((acc, reaction) => {
            acc[reaction.type] = reaction._count.type;
            return acc;
        }, {});
    }
};
