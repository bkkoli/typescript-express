import express from 'express'
const router = express.Router()

import exampleController from '../controllers/exampleController.js'

// Create doc
router.post('/', exampleController.create.bind(exampleController))

// Get All docs
router.get('/', exampleController.getAll.bind(exampleController))

// Get Specific doc
router.get('/:docId', exampleController.get.bind(exampleController))

// Update Specific doc
router.put('/', exampleController.update.bind(exampleController))

// Delete Specific doc
router.delete('/:docId', exampleController.delete.bind(exampleController))

export default router
