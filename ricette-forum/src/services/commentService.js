import { prisma } from '../lib/prisma.js';

export const commentService = {
    async findById(id) {
        return await prisma.comment.findUnique({
            where: { id },
            include: {
                author: {
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
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            }
        });
    },

    async createComment(data) {
        return await prisma.comment.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    },

    async updateComment(id, data) {
        return await prisma.comment.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    },

    async deleteComment(id) {
        return await prisma.comment.delete({
            where: { id }
        });
    },

    async findCommentsByRecipe(recipeId) {
        return await prisma.comment.findMany({
            where: { 
                recipeId,
                parentId: null // Solo commenti principali
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async findReplies(parentId) {
        return await prisma.comment.findMany({
            where: { parentId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    }
};
