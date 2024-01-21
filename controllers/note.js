import { StatusCodes } from 'http-status-codes';
import { createNoteService, deleteNoteService, getAllNotesService, getNoteService, updateNoteService } from '../services/notesService.js';

export const createNote = async (req, res) => {
    const userId = req.user.id

    const { title, content, tags } = req.body

    const savedNote = await createNoteService(title, content, tags, userId)

    res.status(StatusCodes.OK).json(savedNote)

}

export const updateNote = async (req, res) => {

    const updatedNote = await updateNoteService(req)

    res.status(StatusCodes.OK).json(updatedNote)

}

export const deleteNote = async (req, res) => {
    const id = Number(req.params.id)

    await deleteNoteService(id)

    res.status(StatusCodes.NO_CONTENT).end()
}


export const getNote = async (req, res) => {
    const id = Number(req.params.id)

    const note = await getNoteService(id)

    res.status(StatusCodes.OK).json(note)

}

export const getAllNotes = async (req, res) => {
    const userId = req.user.id

    const notes = await getAllNotesService(userId)

    res.status(StatusCodes.OK).json(notes)
}