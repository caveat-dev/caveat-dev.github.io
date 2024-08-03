import { env } from "./env"

export enum FsType {
    FsFile,
    FsFolder
}

export type FsFile = {
    name: string
    contents: string
}

export type FsFolder = {
    name: string,
    contents: (FsFile | FsFolder)[]
}

export function fsInit() {
    localStorage.clear();

    localStorage.setItem("wd", "/home/anon");

    localStorage.setItem("fs", JSON.stringify({
        name: "/",
        contents: [
            {
                name: "home",
                contents: [
                    {
                        name: "anon",
                        contents: []
                    }
                ]
            },
            {
                name: "bin",
                contents: []
            }
        ]
    }
    ));
}

export function getFs() {
    return JSON.parse(localStorage.getItem("fs")!);
}

export function getWd() {
    return localStorage.getItem("wd")!;
}

export function listDir(path: string) {
    let fs = getFs().contents;
    let isGood = true;

    if (!path.startsWith("/")) {
        path = `${getWd()}/${path}`;
    }
    if (path.endsWith("/")) {
        path = path.substring(0, path.length-1);
    }

    let folders = path.split("/");

    let c = true;
    while (c) {
        c = false;
        for (let i = 0; i < folders.length; i++) {
            if (folders[i] === "..") {
                folders.splice(i-1, 2);
                c = true;
            }
        }
    }
    if (folders.length <= 1) {
        folders = [ ]
    }

    console.log(folders)

    folders.forEach((name) => {
        if (name !== "") {
            let found = false;
            fs.forEach((f: FsFile | FsFolder) => {
                if (typeof f.contents !== "string" && f.name === name) {
                    fs = f.contents;
                    found = true;
                    return;
                }
            });
            if (!found) {
                isGood = false;
                return;
            }
         }
    });

    if (isGood) {
        let str: string = "";
        fs.forEach((f: FsFile | FsFolder) => {
            str += `${f.name}`;
            if (typeof f.contents !== "string") { str += "*" }
            str += " ";
        });
        str = str.trim() + "\n";
        if (str.trim() === "") { str = "" }
        return str;
    }
    else {
        path = path.replaceAll("//", "/");
        return `<span style="color: ${env.get("COLORS")!.get("error")!}">Error:</span> invalid path '${path}'\n`;
    }
}

export function setWd(path: string) {
    localStorage.setItem("wd", path);
}

export function changeWd(path: string) {
    if (path === "/") {
        setWd("/");
        return true;
    }
    else if (path === "") {
        setWd("/home/anon");
        return true;
    }

    if (path.startsWith("/")) {
        path = path.substring(1);
        if (path === "") {
            setWd("/");
            return true;
        }
    }
    else {
        path = `${getWd()}/${path}`;
        if (path.endsWith("/")) {
            path = path.substring(0, path.length-1);
        }
    }

    let newWd = "/";
    const files = path.split("/");
    let fs = getFs().contents;

    let c = true;
    while (c) {
        c = false;
        for (let i = 0; i < files.length; i++) {
            if (files[i] === "..") {
                files.splice(i-1, 2);
                c = true;
            }
        }
    }
    if (files.length <= 1) {
        setWd("/");
        return true;
    }

    let found = false;
    files.forEach((name) => {
        found = false;
        fs.forEach((f: FsFile | FsFolder) => {
            if (typeof f.contents !== "string" && f.name === name) {
                fs = f.contents;
                newWd += `${f.name}/`;
                found = true;
                return;
            }
        });
        if (!found) {
            found = false;
            return;
        }
    });
    newWd = newWd.substring(0, newWd.length-1);

    if (found) {
        setWd(newWd);
    }
    return found;
}