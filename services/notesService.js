import { BadRequestError, NotFoundError } from "../errors/index.js"
import { db } from "../lib/db.js"

export const createNoteService = async (title, content, tags, userId) => {
    validateNoteInputs(title, content, tags)

    try {
        const newNote = await db.note.create({
            data: {
                title,
                content,
                tags,
                user: { connect: { id: userId } },
            },
        })
        return newNote
    } catch (err) {
        throw new BadRequestError("An error occurred while creating the note")
    }
}

export const updateNoteService = async (req) => {
    const id = Number(req.params.id)
    const { ...payload } = req.body

    if (!payload) throw new BadRequestError("Fields to update are required")

    try {
        const updatedNote = await db.note.update({
            where: { id },
            data: { ...payload }
        })
        return updatedNote
    } catch (err) {
        throw new NotFoundError('Note not found or no changes were made')
    }
}

export const deleteNoteService = async (id) => {
    try {
        await db.note.delete({
            where: { id }
        })
    } catch (err) {
        throw new NotFoundError('Note not found')
    }
}

export const getAllNotesService = async (userId) => {
    try {
        const notes = await db.note.findMany({
            where: { userId },
        })

        if (notes.length === 0) throw new NotFoundError('Notes not found')

        return notes
    } catch (err) {
        throw new NotFoundError('Notes not found')
    }

}

export const getNoteService = async (id) => {
    try {
        const note = await db.note.findUnique({
            where: { id },
        })
        return note
    } catch (err) {
        throw new NotFoundError('Note not found')
    }

}

function validateNoteInputs(title, content, tags) {
    if (!title || !content || !tags) {
        throw new BadRequestError("Note must have title, content and tags")
    }
    if (tags.length === 0) throw new BadRequestError("Tags must be provided")
}