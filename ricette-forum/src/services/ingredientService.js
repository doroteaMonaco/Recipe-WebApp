import {prisma} from '../lib/prisma.js';

export const ingredientService = {
    async findById(id) {
        return await prisma.ingredient.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                description: true,
                caloriesPer100g: true,
                proteinsPer100g: true,
                carbsPer100g: true,
                fatsPer100g: true,
                fiberPer100g: true,
                sugarPer100g: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    async createIngredient(data) {
        return await prisma.ingredient.create({
            data: data,
            select: {
                id: true,
                name: true,
                description: true,
                caloriesPer100g: true,
                proteinsPer100g: true,
                carbsPer100g: true,
                fatsPer100g: true,
                fiberPer100g: true,
                sugarPer100g: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    async updateIngredient(id, data) {
        return await prisma.ingredient.update({
            where: { id },
            data: data,
            select: {
                 id: true,
                name: true,
                description: true,
                caloriesPer100g: true,
                proteinsPer100g: true,
                carbsPer100g: true,
                fatsPer100g: true,
                fiberPer100g: true,
                sugarPer100g: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    },

    async deleteIngredient(id) {
        return await prisma.ingredient.delete({
            where: { id },
            select: {
                 id: true,
                name: true,
                description: true,
                caloriesPer100g: true,
                proteinsPer100g: true,
                carbsPer100g: true,
                fatsPer100g: true,
                fiberPer100g: true,
                sugarPer100g: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }
}