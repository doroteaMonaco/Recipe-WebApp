import {z} from 'zod';

export const CreateUserSchema = z.object({
    email: z.string()
        .email('Email non valida')
        .min(5, 'Email troppo corta'),
    password: z.string()
        .min(6, 'Password troppo corta')
        .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
        .regex(/[@\-+!?&%$£#]/, 'Deve contenere almeno un carattere speciale')
        .regex(/[0-9]/, 'Deve contenere almeno un numero'),
    name: z.string()
        .min(2, 'Nome troppo corto')
        .max(50, 'Nome troppo lungo')
        .optional(),
    bio: z.string()
        .max(500, 'Bio troppo lunga')
        .optional()
})

export const UpdateUserSchema = z.object({
    name: z.string()
        .min(2, 'Nome troppo corto')
        .max(50, 'Nome troppo lungo')
        .optional(),
    bio: z.string()
        .max(500, 'Bio troppo lunga')
        .optional(),
    image: z.string()
        .url('URL immagine non valido')
        .optional()
})

export const LoginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(1, 'Password richiesta')
})

export const CreateRecipeSchema = z.object({
    name: z.string()
        .min(3, 'Nome ricetta troppo corto')
        .max(100, 'Nome ricetta troppo lungo'),
    description: z.string()
        .max(1500, 'Descrizione troppo lunga')
        .optional(),
    instructions: z.string()
        .min(10, 'Istruzioni troppo corte')
        .max(5000, 'Istruzioni troppo lunghe'),
    prepTime: z.number()
        .min(1, 'Tempo di preparazione troppo breve')
        .max(600, 'Tempo di preparazione troppo lungo (max 10 ore)')
        .int('Deve essere un numero intero')
        .optional(),
    cookTime: z.number()
        .min(1, 'Tempo di cottura troppo breve')
        .max(600, 'Tempo di cottura troppo lungo (max 10 ore)')
        .int('Deve essere un numero intero')
        .optional(),
    servings: z.number()
        .min(1, 'Numero di porzioni non valido')
        .max(20, 'Massimo 20 porzioni')
        .int('Deve essere un numero intero')
        .optional(),
    difficulty: z.enum(['facile', 'medio', 'difficile'])
        .optional(),
    imageUrl: z.string()
        .url('URL immagine non valido')
        .optional(),
    calories: z.number()
        .min(0, 'Calorie non possono essere negative')
        .max(10000, 'Troppe calorie')
        .optional(),
    proteins: z.number()
        .min(0, 'Proteine non possono essere negative')
        .max(1000, 'Troppe proteine')
        .optional(),
    carbs: z.number()
        .min(0, 'Carboidrati non possono essere negativi')
        .max(1000, 'Troppi carboidrati')
        .optional(),
    fats: z.number()
        .min(0, 'Grassi non possono essere negativi')
        .max(1000, 'Troppi grassi')
        .optional(),
    fiber: z.number()
        .min(0, 'Fibre non possono essere negative')
        .max(200, 'Troppe fibre')
        .optional(),
    sugars: z.number()
        .min(0, 'Zuccheri non possono essere negativi')
        .max(1000, 'Troppi zuccheri')
        .optional(),
    
    isPublished: z.boolean().default(false),
})

export const UpdateRecipeSchema = CreateRecipeSchema.partial()

export const CreateIngredientSchema = z.object({
    name: z.string()
        .min(2, 'Nome ingrediente troppo corto')
        .max(100, 'Nome ingrediente troppo lungo'),
    description: z.string()
        .max(500, 'Descrizione troppo lunga')
        .optional(),
    
    caloriesPer100g: z.number()
        .min(0, 'Calorie non possono essere negative')
        .max(1000, 'Troppe calorie per 100g')
        .optional(),
    proteinsPer100g: z.number()
        .min(0, 'Proteine non possono essere negative')
        .max(100, 'Troppe proteine per 100g')
        .optional(),
    carbsPer100g: z.number()
        .min(0, 'Carboidrati non possono essere negativi')
        .max(100, 'Troppi carboidrati per 100g')
        .optional(),
    fatsPer100g: z.number()
        .min(0, 'Grassi non possono essere negativi')
        .max(100, 'Troppi grassi per 100g')
        .optional(),
    fiberPer100g: z.number()
        .min(0, 'Fibre non possono essere negative')
        .max(50, 'Troppe fibre per 100g')
        .optional(),
    sugarPer100g: z.number()
        .min(0, 'Zuccheri non possono essere negativi')
        .max(100, 'Troppi zuccheri per 100g')
        .optional()
})

export const UpdateIngredientSchema = CreateIngredientSchema.partial()

export const CreateRecipeIngredientSchema = z.object({
    recipeId: z.string().cuid('ID ricetta non valido'),
    ingredientId: z.string().cuid('ID ingrediente non valido'),
    quantity: z.number()
        .min(0.1, 'Quantità troppo piccola')
        .max(10000, 'Quantità troppo grande'),
    unit: z.string()
        .min(1, 'Unità richiesta')
        .max(20, 'Unità troppo lunga'),
    notes: z.string()
        .max(200, 'Note troppo lunghe')
        .optional()
})

export const UpdateRecipeIngredientSchema = CreateRecipeIngredientSchema.partial()

export const CreateCommentSchema = z.object({
    content: z.string()
        .min(1, 'Contenuto richiesto')
        .max(2000, 'Commento troppo lungo')
        .refine(
            (val) => val.trim().length > 0,
            'Il commento non può essere solo spazi vuoti'
        ),
    recipeId: z.string().cuid('ID ricetta non valido'),
    parentId: z.string().cuid('ID parent non valido').optional(), // Per reply
})

export const UpdateCommentSchema = z.object({
    content: z.string()
        .min(1, 'Contenuto richiesto')
        .max(2000, 'Commento troppo lungo')
        .refine(
            (val) => val.trim().length > 0,
            'Il commento non può essere solo spazi vuoti'
        )
})

export const CreateReactionSchema = z.object({
    type: z.enum(['like', 'love', 'wow', 'helpful', 'yummy'], {
        errorMap: () => ({ message: 'Tipo di reazione non valido' })
    }),
    recipeId: z.string().cuid('ID ricetta non valido').optional(),
    commentId: z.string().cuid('ID commento non valido').optional(),
})
.refine(
    (data) => data.recipeId || data.commentId,
    'Deve essere specificato recipeId o commentId'
)

export const CreateRatingSchema = z.object({
    stars: z.number()
        .min(1, 'Rating minimo è 1 stella')
        .max(5, 'Rating massimo è 5 stelle')
        .int('Il rating deve essere un numero intero'),
    recipeId: z.string().cuid('ID ricetta non valido')
})

export const UpdateRatingSchema = z.object({
    stars: z.number()
        .min(1, 'Rating minimo è 1 stella')
        .max(5, 'Rating massimo è 5 stelle')
        .int('Il rating deve essere un numero intero')
})

export const SearchRecipesSchema = z.object({
    query: z.string()
        .min(1, 'Query di ricerca richiesta')
        .max(100, 'Query troppo lunga')
        .optional(),
    difficulty: z.enum(['facile', 'medio', 'difficile']).optional(),
    maxCalories: z.number().min(0).max(10000).optional(),
    minCalories: z.number().min(0).max(10000).optional(),
    maxPrepTime: z.number().min(1).max(600).optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0)
})

