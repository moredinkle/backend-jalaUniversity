import { FileStatus } from "./types";

export function stringToFileStatus(status: string) {
    let res: FileStatus | undefined;
    if(status === "REPLICATING") {
        res = "REPLICATING";
    }
    else if(status === "UPLOADED") {
        res = "UPLOADED";
    }
    else {
        res = undefined;
    }
    return res;
}