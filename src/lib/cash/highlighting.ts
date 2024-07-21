import {binaries, type Binary} from "$lib/cash/bin";
import {env} from "$lib/cash/env";

export function parse(str: string) {
    let colors = env.get("COLORS")!;

    // parse headings
    let regex = new RegExp(String.raw`(?<!\\)[a-zA-Z0-9 ]*(?<!https|http):`, "g");
    Array.from(str.matchAll(regex), (matches) => {
        str = str.replaceAll(matches[0], `<span style='color: ${colors.get("heading")!}'>${matches[0].substring(0, matches[0].length)}</span>`);
    });

    // parse binary/command names
    binaries.forEach((binary) => {
        let regex = new RegExp(String.raw`\[${binary.aliases}\]`, "g");
        str = str.replaceAll(regex, `<span style='color: ${colors.get("command")!}'>${prettyAliases(binary)}</span>`);
    });

    // parse links
    regex = new RegExp(String.raw`(https)://\S*`, "g");
    Array.from(str.matchAll(regex), (matches) => {
        str = str.replaceAll(matches[0], `<span style='color: ${colors.get("link")}'>${matches[0]}</span>`);
    });

    str = str.replaceAll(/\n|\\n/g, "<br>");
    str = str + "<br>";

    return `<span style="word-break: normal; hyphens: auto">${str}</span>`;
}

function prettyAliases(binary: Binary) {
    return `[${binary.aliases.toString().replaceAll(",", ", ")}]`;
}
