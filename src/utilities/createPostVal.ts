import dayjs from "dayjs";
import React from 'react'

export function checkTitle(
    input: string,
    minChar: number = 0,
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
export function checkLocation(
    input: string,
    minChar: number = 0)
    : string {
    if (input.length < minChar) {
        return "ช่องนี้ไม่สามารถเว้นว่างได้";
    }
    return "";
}
export function checkTag(
    input: any,
    minChar: number = 1,
    maxChar: number = 5)
    : string {
    if (input.length < minChar) {
        return "กรุณาเลือกอย่างน้อย 1 Tag";
    }
    if (input.length > maxChar) {
        return `เลือกได้ไม่เกิน ${maxChar} Tag`;
    }
    return "";
}
export function checkStartDate(
    startDate: dayjs)
    : string {
    const isBeforeNow = startDate.isBefore(dayjs());

    if (isBeforeNow) {
        return "ไม่สามารถเลือกวันที่และเวลาก่อนปัจจุบันได้";
    }
    return "";
}

export function checkEndDate(
    startDate: dayjs,
    endDate: dayjs)
    : string {
    const isBeforeNow = endDate.isBefore(startDate);

    if (isBeforeNow) {
        return `กรุณาเลือกวันที่และเวลา หลังจาก ${startDate}`;
    }
    return "";
}
export function checkDesc(
    input: string,
    minChar: number = 0,
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
export function checkImg(
    input: string,
    max: number = 3)
    : string {
    if (input.length > maxChar) {
        return `เลือกรูปภาพได้ไม่เกิน ${max} รูป`;
    }
    return "";
}