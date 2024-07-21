export let env = new Map([
    [
        "COLORS",
        new Map([
            ["text", "#cdd6f4"],
            ["error", "#f38ba8"],
            ["warning", "#f9e2af"],
            ["success", "#a6e3a1"],
            ["heading", "#cba6f7"],
            ["link", "#89b4fa"],
            ["command", "#f5e0dc"]
        ]),
    ],
]);

export function getVariable(name: string) {
    let variable = env.get(name);
    if (!variable) { return ""; }

    let str = "";
    variable.forEach((value, key) => {
        str += `${key}: ${value}\n`
    });
    return str.substring(0, str.length-1);
}

export function variableToString(name: string) {
    let variable = env.get(name);
    if (!variable) { return ""; }

    let str = "";
    variable.forEach((value, key) => {
        str += `${key}: ${value}\n`;
    });
    return str.substring(0, str.length-1);
}
