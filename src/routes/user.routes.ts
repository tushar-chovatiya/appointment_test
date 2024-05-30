import { Router } from "express"; 
import { UserController } from '../controller/user.controller'
import { CreateUserDto } from "../dtos/user.dto";
import validationMiddleware from "../middleware/validation.midlleware";
const router = Router();


router.get("/users", UserController.getAll);
router.get("/users/:id", UserController.getOneUser);
router.post("/users",validationMiddleware(CreateUserDto, 'body'), UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;