
import dayjs, { Dayjs } from "dayjs";


export function checkTitle(
    input: string,
    minChar: number = 1,
    maxChar: number = 100)
    : string {
    if (input.length < minChar) {
        return "ช่องนี้ไม่สามารถเว้นว่างได้";
    }
    if (input.length > maxChar) {
        return `ช่องนี้มีตัวอักษรได้ไม่เกิน ${maxChar} ตัว`;
    }
    return "";
}

export function checkTag(
    input: any,
    minTag: number = 1,
    maxTag: number = 5)
    : string {
    if (input.length < minTag) {
        return "กรุณาเลือกอย่างน้อย 1 Tag";
    }
    if (input.length > maxTag) {
        return `เลือกได้ไม่เกิน ${maxTag} Tag`;
    }
    return "";
}
export function checkStartDate(
    startDate: Dayjs | null)
    : string {
    if (!startDate) return ""
    const isBeforeNow = startDate.isBefore(dayjs());

    if (isBeforeNow) {
        return "ไม่สามารถเลือกวันที่และเวลาก่อนปัจจุบันได้";
    }
    return "";
}

export function checkEndDate(
    startDate: Dayjs | null,
    endDate: Dayjs | null)
    : string {
    if (!startDate || !endDate) return ""
    const isBeforeNow = endDate.isBefore(startDate);

    if (isBeforeNow) {
        return `กรุณาเลือกวันที่และเวลา หลังจาก ${startDate}`;
    }
    return "";
}
export function checkDesc(
    input: string,
    minChar: number = 1,
    maxChar: number = 500)
    : string {
    if (input.length < minChar) {
        return "ช่องนี้ไม่สามารถเว้นว่างได้";
    }
    if (input.length > maxChar) {
        return `ช่องนี้มีตัวอักษรได้ไม่เกิน ${maxChar} ตัว`;
    }
    return "";
}

