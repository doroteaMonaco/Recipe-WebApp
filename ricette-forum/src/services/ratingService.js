import { prisma } from '../lib/prisma.js';

export const ratingService = {
    async findById(id) {
        return await prisma.rating.findUnique({
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

    async createRating(data) {
        return await prisma.rating.create({
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

    async updateRating(id, data) {
        return await prisma.rating.update({
            where: { id },
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

    async deleteRating(id) {
        return await prisma.rating.delete({
            where: { id }
        });
    },

    async findRatingsByRecipe(recipeId) {
        return await prisma.rating.findMany({
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

    async findUserRatingOnRecipe(userId, recipeId) {
        return await prisma.rating.findFirst({
            where: {
                userId,
                recipeId
            }
        });
    },

    async upsertRating(userId, recipeId, score, review = null) {
        return await prisma.rating.upsert({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId
                }
            },
            update: {
                score,
                review
            },
            create: {
                userId,
                recipeId,
                score,
                review
            },
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

    async getRecipeAverageRating(recipeId) {
        const result = await prisma.rating.aggregate({
            where: { recipeId },
            _avg: {
                score: true
            },
            _count: {
                score: true
            }
        });

        return {
            averageRating: result._avg.score || 0,
            totalRatings: result._count.score
        };
    },

    async getTopRatedRecipes(limit = 10) {
        // Query più complessa per ottenere ricette con rating medio alto
        const recipes = await prisma.recipe.findMany({
            where: {
                isPublished: true,
                ratings: {
                    some: {} // Solo ricette che hanno almeno un rating
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                ratings: {
                    select: {
                        score: true
                    }
                },
                _count: {
                    select: {
                        ratings: true,
                        comments: true,
                        reactions: true
                    }
                }
            },
            take: limit * 2 // Prendiamo più ricette per poi filtrarle
        });

        // Calcola la media e ordina
        const recipesWithAverage = recipes.map(recipe => {
            const totalScore = recipe.ratings.reduce((sum, rating) => sum + rating.score, 0);
            const averageRating = totalScore / recipe.ratings.length;
            
            return {
                ...recipe,
                averageRating,
                totalRatings: recipe.ratings.length
            };
        });

        // Ordina per rating medio (minimo 3 rating per essere considerato)
        return recipesWithAverage
            .filter(recipe => recipe.totalRatings >= 3)
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, limit)
            .map(({ ratings, ...recipe }) => recipe); // Rimuovi i ratings grezzi
    }
};
