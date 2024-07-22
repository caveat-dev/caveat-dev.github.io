import {parse} from "$lib/cash/highlighting";
import {env, getVariable} from "$lib/cash/env";

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
        "Displays the welcome message.",
        "welcome",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("welcome")!); }
            let welcomeMessage = `Welcome to CAVM 1.0.0.\nType [${binaries.get("help")!.aliases}] for a list of commands.`;
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
        "Displays available commands.",
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

            let lowerBound = (page * 3) - 3;
            let upperBound = Math.min(lowerBound + 2, binaries.size-1);
            let toParse = "";
            let binariesArr = Array.from(binaries);
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
        "Displays Caveat's git pages, socials, and other accounts online.",
        "accounts",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("accounts")!); }
            let toParse = "Email: cv@caveat.cc\nDiscord: caveat__\nGit Accounts:\nhttps://codeberg.org/caveat (preferred)\nhttps://github.com/caveat-dev"
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
        "Displays Caveat's bio.",
        "bio",
        (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries.get("bio")!); }
            let toParse = "Caveat (often stylized as caveat, full name Caveat Emptor) is an amateur developer and FOSS enthusiast from North America.\nThey enjoy developing programs in Rust and Haskell, but begrudgingly use Javascript the most.\nWatch them develop open-source software that nobody uses!"
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
        "Prints the given text.",
        "bio",
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
    )
]);

export function execute(str: string, input: string, history: string): ExecutionResult {
    let words = str.replace("\\n", " <br> ").split(" ");

    let result: ExecutionResult = {
        result: false,
        text: `<span style="color: ${env.get("COLORS")!.get("error")!}">Error:</span> command not found: '${words[0]}'\n`,
        historyChanged: false,
        newHistory: null
    };
    let found = false;
    binaries.forEach((binary) => {
        if (binary.aliases.includes(words[0])) {
            result = binary.callback(words.slice(1, words.length), input, history);
            found = true;
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
