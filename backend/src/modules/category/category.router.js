import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.post('/upsert', auth, categoryController.upsertCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

export default router;
