import fs from "fs";
import path from "path";

export interface Grade {
    id: number;

    student: string;
    subject: string;
    type: string;
    value: number;
    timestamp: string;
}
export interface Data {
    nextId: number;
    grades: Grade[];
}

const jsonFile = path.resolve(__dirname, "grades.json");

export const read = async () => {
    try {
        const file = await fs.promises.readFile(jsonFile, "utf8");
        const json = JSON.parse(file.toString()) as Data;
        return json;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const write = async (data: Data) => {
    try {
        await fs.promises.writeFile(jsonFile, JSON.stringify(data));
        return data;
    } catch (err) {
        return Promise.reject(err);
    }
};
