export class PresentForm {
    gmt: string;
    mnd: string;
    led: Weeks;
    opw: Weeks;
    totled: number;
    totopw: number;
    gemled: number;
    gemopw: number;
    isNew?: boolean;
    created?: string;
    edited?: string;
    creator?: string;
}

export interface Weeks {
    w1: number | boolean | string;
    w2: number;
    w3: number;
    w4: number;
    w5: number | boolean | string;
}