import {parse} from "$lib/cash/highlighting";
import {env, getVariable} from "$lib/cash/env";
import { changeWd, getWd, listDir } from "./fs";

const leftAngleBracket = "&lt;";
const rightAngleBracket = "&gt;";

export type Binary = {
    aliases: string[],
    description: string,
    usage: string,
    callback: (args: string[], input?: string, history?: string) => ExecutionResult
}

function createBinary(aliases: string[], description: string, usage: string, callback: (args: string[], input?: string, history?: string) => ExecutionResult): Binary {
    return {
        aliases: aliases,
        description: description,
        usage: usage,
        callback: callback,
    }
}

function createMappedBinary(aliases: string[], description: string, usage: string, callback: (args: string[], input?: string, history?: string) => ExecutionResult): [string, Binary] {
    return [aliases[0], createBinary(aliases, description, usage, callback)];
}

export type ExecutionResult = {
    result: boolean;
    text: string | null;
    historyChanged: boolean;
    newHistory: string | null;
}

export const binaries: Map<string, Binary> = new Map([
    createMappedBinary(
        ["welcome"],
        "Prints the welcome message.",
        "welcome",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("welcome")!); }
            const welcomeMessage = `Welcome to CAVM 1.0.0.\nType [${binaries.get("help")!.aliases}] for a list of commands.`;
            return {
                result: true,
                text: parse(welcomeMessage),
                historyChanged: false,
                newHistory: null
            };
        }
    ),
    createMappedBinary(
        ["help", "h"],
        "Prints available commands.",
        `help, help ${leftAngleBracket}#page${rightAngleBracket}`,
        (args) => {
            let page = 1;
            if (args.length > 1) {
                return returnInvalidArgs(binaries.get("help")!);
            }
            else if (args.length != 0) {
                page = Number.parseInt(args[0]);
                if (isNaN(page)) {
                    return returnInvalidArgs(binaries.get("help")!);
                }
                page = Math.max(1, page);
                page = Math.min(Math.ceil(binaries.size / 3), page)
            }

            const lowerBound = (page * 3) - 3;
            const upperBound = Math.min(lowerBound + 2, binaries.size-1);
            let toParse = "";
            const binariesArr = Array.from(binaries);
            for (let i = lowerBound; i <= upperBound; i++) {
                toParse += `[${binariesArr[i][1].aliases}]\nDescription: ${binariesArr[i][1].description}\nUsage: ${binariesArr[i][1].usage}\n`;
            }
            toParse += `Page ${page}/${Math.ceil(binaries.size / 3)}`

            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null
            };
        }
    ),
    createMappedBinary(
        ["clear", "cls"],
        "Clears the screen.",
        "cls",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("clear")!); }
            return {
                result: true,
                text: null,
                historyChanged: true,
                newHistory: ""
            };
        }
    ),
    createMappedBinary(
        ["accounts"],
        "Prints Caveat's git pages, socials, and other accounts online.",
        "accounts",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("accounts")!); }
            const toParse = "Email: cv@caveat.cc\nDiscord: caveat__\nGit Accounts:\nhttps://codeberg.org/caveat (preferred)\nhttps://github.com/caveat-dev"
            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
    createMappedBinary(
        ["bio"],
        "Prints Caveat's bio.",
        "bio",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("bio")!); }
            const toParse = "Caveat (often stylized as caveat, full name Caveat Emptor) is an amateur developer and FOSS enthusiast from North America.\nThey enjoy developing programs in Rust and Haskell, but begrudgingly use Javascript the most.\nWatch them develop open-source software that nobody uses!"
            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
    createMappedBinary(
        ["echo"],
        "Prints the given text and/or environment variables.",
        `echo ${leftAngleBracket}text${rightAngleBracket}`,
        (args): ExecutionResult => {
            let toParse = "";
            args.forEach((arg) => {
                if (arg.startsWith("$")) {
                    toParse = toParse.substring(0, toParse.length-1);
                    toParse += `${getVariable(arg.substring(1, arg.length))} `;
                }
                else {
                    toParse += `${arg} `;
                }
            });
            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
    createMappedBinary(
        ["print-env", "printenv"],
        "Prints the names of the current environment variables.",
        "print-env",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("print-env")!) }

            const envArray = Array.from(env);
            let toParse = "";
            envArray.forEach((entry) => {
                toParse += `${entry[0]}, `
            })
            toParse = toParse.substring(0, toParse.length-2);

            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
    createMappedBinary(
        ["print-var", "printvar"],
        `Prints the values of the given environment variable. Functionally identical to '$ECHO ${leftAngleBracket}var${rightAngleBracket}'`,
        `print-var ${leftAngleBracket}var${rightAngleBracket}`,
        (args): ExecutionResult => {
            if (args.length !== 1) {
                return returnInvalidArgs(binaries.get("print-var")!);
            }

            args[0] = args[0].replace("$", "");
            const variable = env.get(args[0]);
            if (!variable) {
                return {
                    result: false,
                    text: `<span style='color: ${env.get("COLORS")!.get("error")!}'>Error:</span> Unknown environment variable '${args[0]}'.\n`,
                    historyChanged: false,
                    newHistory: null,
                }
            }

            return {
                result: true,
                text: parse(getVariable(args[0])),
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
    createMappedBinary(
        ["ls"],
        "Lists the given or current directory.",
        `ls ${leftAngleBracket}path${rightAngleBracket}`,
        (args): ExecutionResult => {
            let toParse = "";
            if (args.length === 0) {
                toParse += listDir("");
            }
            else if (args.length === 1) {
                toParse += listDir(args[0]);
            }
            else {
                return returnInvalidArgs(binaries.get("ls")!);
            }

            return {
                result:  true,
                text: toParse,
                historyChanged: false,
                newHistory: null,
            };
        }
    ),
    createMappedBinary(
        ["cd"],
        "Changes the working directory.",
        `cd ${leftAngleBracket}path${rightAngleBracket}`,
        (args): ExecutionResult => {
            let result;
            if (args.length === 0) {
                result = changeWd("");
            }
            else if (args.length !== 1) {
                return returnInvalidArgs(binaries.get("cd")!);
            }
            else {
                result = changeWd(args[0]);
            }
            
            let text = "";
            if (!result) {
                text = `<span style="color: ${env.get("COLORS")!.get("error")!}">Error:</span> invalid path '${args[0]}'\n`;
            }
            return {
                result: result,
                text: text,
                historyChanged: false,
                newHistory: null
            };
        }
    ),
    createMappedBinary(
        ["pwd"],
        "Prints the working directory.",
        "pwd",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("pwd")!) }
            return {
                result: true,
                text: `${getWd()}\n`,
                historyChanged: false,
                newHistory: null,
            }
        }
    ),
]);

export function execute(str: string, input: string, history: string): ExecutionResult {
    const words = str.replace("\\n", " <br> ").trim().split(" ");

    let result: ExecutionResult = {
        result: false,
        text: `<span style="color: ${env.get("COLORS")!.get("error")!}">Error:</span> command not found: '${words[0]}'\n`,
        historyChanged: false,
        newHistory: null
    };
    binaries.forEach((binary) => {
        if (binary.aliases.includes(words[0])) {
            result = binary.callback(words.slice(1, words.length), input, history);
            return;
        }
    });
    return result;
}

function returnInvalidArgs(binary: Binary) {
    return {
        result: false,
        text: `<span style="color: ${env.get("COLORS")!.get("error")}">Error:</span> invalid args provided.\n<span style="color: ${env.get("COLORS")!.get("heading1")}">Usage:</span> <span style="color: ${env.get("COLORS")!.get("command")}">[${binary.usage.toString().replaceAll(",", ", ")}]</span>\n`,
        historyChanged: false,
        newHistory: null,
    }
}
