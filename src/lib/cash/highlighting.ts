import {binaries, type Binary} from "$lib/cash/bin";

export enum Color {
    Text = "#cdd6f4",
    Error = "#f38ba8",
    Warning = "#f9e2af",
    Success = "#a6e3a1",
    Heading1 = "#cba6f7",
    Heading2 = "#89b4fa",
    Heading3 = "#94e2d5",
    Link = "#89b4fa",
    Command = "#f5e0dc",
}

export function parse(str: string) {
    str.replaceAll("\n", "<br>");

    // parse headings
    let regex = new RegExp(String.raw`\S*(?<!https|http):`, "g");
    Array.from(str.matchAll(regex), (matches) => {
        str = str.replaceAll(matches[0], `<span style='color: ${Color.Heading1}'>${matches[0].substring(0, matches[0].length)}</span>`);
    });

    // parse binary/command names
    binaries.forEach((binary) => {
        let regex = new RegExp(String.raw`\[${binary.aliases}\]`, "g");
        str = str.replaceAll(regex, `<span style='color: ${Color.Command}'>${prettyAliases(binary)}</span>`);
    });

    // parse links
    regex = new RegExp(String.raw`(https)://\S*`, "g");
    Array.from(str.matchAll(regex), (matches) => {
        str = str.replaceAll(matches[0], `<span style='color: ${Color.Link}'>${matches[0]}</span>`);
    });

    str = str.replaceAll("+", " ") + "<br>";

    return `<span style="word-break: normal; hyphens: auto">${str}</span>`;
}

function prettyAliases(binary: Binary) {
    return `[${binary.aliases.toString().replaceAll(",", ", ")}]`;
}
