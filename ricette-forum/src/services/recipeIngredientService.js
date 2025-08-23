import {prisma} from '../lib/prisma.js';

export const recipeIngredientService = {
    async findById(id) {
        return await prisma.recipeIngredient.findUnique({
            where: {id},
            select: {
                id: true,
                quantity: true,
                unit: true,
                notes: true,
                recipeId: true,
                ingredientId: true,
            }
        })
    },

    async createRecipeIngredient(data) {
        return await prisma.recipeIngredient.create({
            data: data,
            select: {
                id: true,
                quantity: true,
                unit: true,
                notes: true,
                recipeId: true,
                ingredientId: true,
            }
        })
    },

    async updateRecipeIngredient(id, data) {
        return await prisma.recipeIngredient.update({
            where: { id },
            data: data,
            select: {
                id: true,
                quantity: true,
                unit: true,
                notes: true,
                recipeId: true,
                ingredientId: true,
            }
        })
    },

    async deleteRecipeIngredient(id) {
        return await prisma.recipeIngredient.delete({
            where: { id },
            select: {
                id: true,
                quantity: true,
                unit: true,
                notes: true,
                recipeId: true,
                ingredientId: true,
            }
        })
    }
}