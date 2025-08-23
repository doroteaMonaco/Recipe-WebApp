import { prisma } from '../lib/prisma.js';

export const badgeService = {
    async findById(id) {
        return await prisma.badge.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    },

    async findAll() {
        return await prisma.badge.findMany({
            include: {
                _count: {
                    select: {
                        users: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    },

    async createBadge(data) {
        return await prisma.badge.create({
            data
        });
    },

    async updateBadge(id, data) {
        return await prisma.badge.update({
            where: { id },
            data
        });
    },

    async deleteBadge(id) {
        return await prisma.badge.delete({
            where: { id }
        });
    },

    async findUserBadges(userId) {
        return await prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true
            },
            orderBy: { earnedAt: 'desc' }
        });
    },

    async awardBadge(userId, badgeId) {
        // Controlla se l'utente ha già questo badge
        const existing = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId
                }
            }
        });

        if (existing) {
            throw new Error('User already has this badge');
        }

        return await prisma.userBadge.create({
            data: {
                userId,
                badgeId
            },
            include: {
                badge: true,
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

    async removeBadge(userId, badgeId) {
        return await prisma.userBadge.delete({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId
                }
            }
        });
    },

    async checkAndAwardAutomaticBadges(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                recipes: {
                    where: { isPublished: true }
                },
                comments: true,
                reactions: true,
                ratings: true,
                badges: {
                    include: {
                        badge: true
                    }
                }
            }
        });

        if (!user) return [];

        const currentBadges = user.badges.map(ub => ub.badge.name);
        const newBadges = [];

        // Badge per numero di ricette
        if (user.recipes.length >= 1 && !currentBadges.includes('First Recipe')) {
            const badge = await prisma.badge.findFirst({ where: { name: 'First Recipe' } });
            if (badge) {
                await this.awardBadge(userId, badge.id);
                newBadges.push(badge);
            }
        }

        if (user.recipes.length >= 10 && !currentBadges.includes('Recipe Master')) {
            const badge = await prisma.badge.findFirst({ where: { name: 'Recipe Master' } });
            if (badge) {
                await this.awardBadge(userId, badge.id);
                newBadges.push(badge);
            }
        }

        // Badge per commenti
        if (user.comments.length >= 10 && !currentBadges.includes('Active Commenter')) {
            const badge = await prisma.badge.findFirst({ where: { name: 'Active Commenter' } });
            if (badge) {
                await this.awardBadge(userId, badge.id);
                newBadges.push(badge);
            }
        }

        // Badge per reazioni
        if (user.reactions.length >= 50 && !currentBadges.includes('Social Butterfly')) {
            const badge = await prisma.badge.findFirst({ where: { name: 'Social Butterfly' } });
            if (badge) {
                await this.awardBadge(userId, badge.id);
                newBadges.push(badge);
            }
        }

        return newBadges;
    },

    async getBadgeLeaderboard() {
        return await prisma.user.findMany({
            include: {
                badges: {
                    include: {
                        badge: true
                    }
                }
            },
            orderBy: {
                badges: {
                    _count: 'desc'
                }
            },
            take: 10
        });
    }
};
