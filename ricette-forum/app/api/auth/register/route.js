import { AuthController } from "../../../../src/controllers/authController";

export async function POST(request) {
    const authController = new AuthController();
    return authController.register(request);
}
