import express from "express";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../controllers/note.js";

const router = express.Router();

router.post("/", createNote)

router.get("/", getAllNotes)
router.get("/:id", getNote)

router.put("/:id", updateNote)

router.delete("/:id", deleteNote)


export default router;