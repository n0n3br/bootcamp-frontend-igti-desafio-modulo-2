import * as db from "../database";
import { Request, Response } from "express";
let data: db.Data;

const init = async () => {
    const json = await db.read();
    data = { ...json };
};

export const index = async (req: Request, res: Response) => {
    try {
        if (data) return res.json(data.grades);
        const json = await db.read();
        data = { ...json };
        return res.json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const post = async (req: Request, res: Response) => {
    try {
        const { student, subject, type, value } = req.body;
        const newData = {
            id: data.nextId,
            student,
            subject,
            type,
            value,
            timestamp: new Date().toISOString(),
        };
        data = {
            nextId: data.nextId + 1,
            grades: [...data.grades, newData],
        };
        await db.write(data);
        return res.json(newData);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        data = {
            ...data,
            grades: data.grades.filter((d) => d.id !== Number(id)),
        };
        await db.write(data);
        return res.send(id);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const put = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { student, subject, type, value } = req.body;
        let grade = data.grades.find((d) => d.id === Number(id));
        if (!grade) {
            throw new Error("nota inexistente");
            return;
        }
        grade = {
            ...grade,
            student,
            subject,
            type,
            value,
            timestamp: new Date().toISOString(),
        };
        data = {
            ...data,
            grades: data.grades.map((d) =>
                d.id === Number(id) ? grade : d
            ) as db.Grade[],
        };
        await db.write(data);
        return res.json(grade);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const show = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const grade = data.grades.find((grade) => grade.id === Number(id));
        if (!grade) throw new Error(`id ${id} não encontrado`);
        return res.json(grade);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const total = (req: Request, res: Response) => {
    try {
        let { student, subject } = req.query;
        if (!student || !subject) throw new Error("informe student e subject");
        const grades = data.grades.filter(
            (grade) =>
                grade.student.toLowerCase() === String(student).toLowerCase() &&
                grade.subject.toLowerCase() === String(subject).toLowerCase()
        );
        if (!grades.length)
            throw new Error(
                `nenhuma nota encontrada para o aluno ${student} na matéria ${subject}`
            );
        const total = parseFloat(
            grades.reduce((memo, grade) => memo + grade.value, 0).toFixed(2)
        );
        return res.json({ student, subject, total });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const average = (req: Request, res: Response) => {
    try {
        let { type, subject } = req.query;
        if (!type || !subject) {
            throw new Error("informe type e subject");
        }
        const grades = data.grades.filter(
            (grade) =>
                grade.type.toLowerCase() === String(type).toLowerCase() &&
                grade.subject.toLowerCase() === String(subject).toLowerCase()
        );
        if (!grades.length)
            throw new Error(
                `nenhuma nota encontrada para o tipo ${type} na matéria ${subject}`
            );
        const average = parseFloat(
            (
                grades.reduce((memo, grade) => memo + grade.value, 0) /
                grades.length
            ).toFixed(2)
        );
        return res.json({ type, subject, average });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const best = (req: Request, res: Response) => {
    try {
        const { type, subject } = req.query;
        if (!type || !subject) throw new Error("informe type e subject");
        const grades = data.grades.filter(
            (grade) =>
                grade.type.toLowerCase() === String(type).toLowerCase() &&
                grade.subject.toLowerCase() === String(subject).toLowerCase()
        );
        if (!grades.length)
            throw new Error(
                `nenhuma nota encontrada para o tipo ${type} na matéria ${subject}`
            );
        const top = grades.sort((a, b) => b.value - a.value).slice(0, 3);
        return res.json({ type, subject, top });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

init();
