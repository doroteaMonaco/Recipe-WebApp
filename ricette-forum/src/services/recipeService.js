import {prisma} from '../lib/prisma.js';

export const recipeService = {
    async findById(id) {
        return await prisma.recipe.findUnique({
            where: {id},
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                ratings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                        ratings: true
                    }
                }
            }
        })
    },

    async createRecipe(data) {
        return await prisma.recipe.create({
            data: data,
            select: {
                id: true,
                name: true,
                description: true,
                instructions: true,
                prepTime: true,
                cookTime: true,
                servings: true,
                difficulty: true,
                imageUrl: true,
                calories: true,
                proteins: true,
                carbs: true,
                fats: true,
                fiber: true,
                sugars: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    async updateRecipe(id, data) {
        return await prisma.recipe.update({
            where: { id },
            data: data,
            select: {
                id: true,
                name: true,
                description: true,
                instructions: true,
                prepTime: true,
                cookTime: true,
                servings: true,
                difficulty: true,
                imageUrl: true,
                calories: true,
                proteins: true,
                carbs: true,
                fats: true,
                fiber: true,
                sugars: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    async deleteRecipe(id) {
        return await prisma.recipe.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                instructions: true,
                prepTime: true,
                cookTime: true,
                servings: true,
                difficulty: true,
                imageUrl: true,
                calories: true,
                proteins: true,
                carbs: true,
                fats: true,
                fiber: true,
                sugars: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    // Metodi aggiuntivi utili
    async findPublishedRecipes(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        return await prisma.recipe.findMany({
            where: { isPublished: true },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                        ratings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
    },

    async searchRecipes(query) {
        return await prisma.recipe.findMany({
            where: {
                AND: [
                    { isPublished: true },
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                        ratings: true
                    }
                }
            },
            take: 20
        });
    },

    async findRecipesByAuthor(authorId) {
        return await prisma.recipe.findMany({
            where: { 
                authorId,
                isPublished: true 
            },
            include: {
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                        ratings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}