import {Color, parse} from "$lib/cash/highlighting";

const leftAngleBracket = "&lt;";
const rightAngleBracket = "&gt;";

export type Binary = {
    aliases: string[],
    description: string,
    usage: string,
    callback: (args: string[], input: string | null, history: string | null) => ExecutionResult
}

export type ExecutionResult = {
    result: boolean;
    text: string | null;
    historyChanged: boolean;
    newHistory: string | null;
}

export const binaries: Binary[] = [
    {
        aliases: ["welcome"],
        description: "Displays the welcome message.",
        usage: "welcome",
        callback: (args) => {
            if (args.length !== 0) { return returnInvalidArgs(binaries[0]); }
            let welcomeMessage = `Welcome to https://caveat.cc!\nType [${binaries[1].aliases}] for a list of commands.`;
            return {
                result: true,
                text: parse(welcomeMessage),
                historyChanged: false,
                newHistory: null
            };
        }
    },
    {
        aliases: ["help", "h"],
        description: "Displays available commands.",
        usage: `help, help ${leftAngleBracket}#page${rightAngleBracket}`,
        callback: (args) => {
            let page = 1;
            if (args.length > 1) {
                return returnInvalidArgs(binaries[1]);
            }
            else if (args.length != 0) {
                page = Number.parseInt(args[0]);
                if (isNaN(page)) {
                    return returnInvalidArgs(binaries[1]);
                }
                page = Math.max(1, page);
                page = Math.min(Math.ceil(binaries.length / 3), page)
            }

            let lowerBound = (page * 3) - 3;
            let upperBound = Math.min(lowerBound + 2, binaries.length-1);
            let toParse = "";
            for (let i = lowerBound; i <= upperBound; i++) {
                toParse += `[${binaries[i].aliases}]\nDescription: ${binaries[i].description}\nUsage: ${binaries[i].usage}\n`;
            }
            toParse += `Page ${page}/${Math.ceil(binaries.length / 3)}`

            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null
            };
        }
    },
    {
      aliases: ["clear", "cls"],
      description: "Clears the screen.",
      usage: "cls",
      callback: (args): ExecutionResult => {
          if (args.length !== 0) { return returnInvalidArgs(binaries[2]); }
          return {
              result: true,
              text: null,
              historyChanged: true,
              newHistory: ""
          };
      }
    },
    {
        aliases: ["accounts"],
        description: "Displays Caveat's git pages, socials and other accounts online.",
        usage: "accounts",
        callback: (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries[3]); }
            let toParse = "Email: cv@caveat.cc\nDiscord: caveat__\nGit+Accounts:\nhttps://codeberg.org/caveat (preferred)\nhttps://github.com/caveat-dev"
            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    },
    {
        aliases: ["bio"],
        description: "Displays Caveat's bio.",
        usage: "bio",
        callback: (args): ExecutionResult => {
            if (args.length !== 0) { return returnInvalidArgs(binaries[4]); }
            let toParse = "Caveat (often stylized as caveat, full name Caveat Emptor) is an amateur developer and FOSS enthusiast from North America.\nThey enjoy developing programs in Rust and Haskell, but begrudgingly use Javascript the most.\nWatch them develop open-source software that nobody uses!"
            return {
                result: true,
                text: parse(toParse),
                historyChanged: false,
                newHistory: null,
            }
        }
    },
]

export function execute(str: string, input: string, history: string): ExecutionResult {
    let words = str.split(" ");

    let result: ExecutionResult = {
        result: false,
        text: `<span style="color: ${Color.Error}">Error:</span> command not found: '${words[0]}'\n`,
        historyChanged: false,
        newHistory: null
    };
    words.forEach((command) => {
        binaries.forEach((binary) => {
            if (binary.aliases.includes(command)) {
                result = binary.callback(words.slice(1, words.length), input, history);
                return;
            }
        });
    });
    return result;
}

function returnInvalidArgs(binary: Binary) {
    return {
        result: false,
        text: `<span style="color: ${Color.Error}">Error:</span> invalid args provided.\n<span style="color: ${Color.Heading1}">Usage:</span> <span style="color: ${Color.Command}">[${binary.usage.toString().replaceAll(",", ", ")}]</span>\n`,
        historyChanged: false,
        newHistory: null,
    }
}
