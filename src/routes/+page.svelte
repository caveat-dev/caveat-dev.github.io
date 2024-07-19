<script lang="ts">
    import {onMount} from "svelte";

    let terminalContainer: HTMLElement;
    let terminalInput: HTMLElement;
    let inputDisplay: HTMLElement;
    let historyDisplay: HTMLElement;

    let input: string = "";

    let typing = false;
    let carrotVisible = true;

    let welcomeMessage = 'Welcome to <a href=\'https://caveat.cc\'>https://caveat.cc</a>!<br>Type "help" for a list of commands.'

    onMount(() => {
        terminalInput.focus();
        resizeTerminal();
        window.addEventListener('resize', resizeTerminal);

        historyDisplay.innerHTML = welcomeMessage + "<br>";

        setInterval(() => {
            if (typing) {
                carrotVisible = true;
            }
            else {
                carrotVisible = !carrotVisible;
            }
        }, 1000);

        setInterval(() => {
            setInputDisplay(input, carrotVisible);
        }, 1);
    });

    function resizeTerminal() {
        if (!terminalContainer) { return; }

        let shortestSidePx = Math.min(window.innerHeight, window.innerWidth) * 0.95;
        terminalContainer.style.width = shortestSidePx + "px";
        terminalContainer.style.height = shortestSidePx + "px";
        fitHistoryToDisplay();
    }

    function fitHistoryToDisplay() {
        if (!terminalContainer || !historyDisplay) { return; }
        let i = 0;
        while (historyDisplay.clientHeight + 30 >= terminalContainer.clientHeight && i < 1000) {
            const index = historyDisplay.innerHTML.indexOf("<br>");
            const html = historyDisplay.innerHTML;
            historyDisplay.innerHTML = html.substring(index+4, html.length);

            i++;
        }
    }

    function clearHistory() {
        if (!historyDisplay) { return; }
        historyDisplay.innerHTML = "";
    }

    function addToHistory(s: string) {
        if (!historyDisplay) { return; }
        historyDisplay.innerHTML += s + "<br>";
        fitHistoryToDisplay();
    }

    function addInputToHistory(s: string, success = true) {
        historyDisplay.innerHTML += '<span class="terminal-prompt-history">></span> ';
        if (success) { historyDisplay.innerHTML += `<span class="terminal-history-command-success"">${s}</span>`; }
        else { historyDisplay.innerHTML += `<span class="terminal-history-command-failure"">${s}</span>`; }
        historyDisplay.innerHTML += "<br>"
    }

    function setInputDisplay(s: string, showCarrot: boolean) {
        if (!inputDisplay) { return; }
        inputDisplay.innerHTML = s;
        if (showCarrot) { inputDisplay.innerHTML += "<span class=\"terminal-cursor\">▌</span>"; }
    }

    function parseInput(input: string) {
        let statements = input.split("&");

        let callbacks: (() => void)[] = [];
        statements.forEach((statement) => {
            statement = statement.toLowerCase().trim();

            let helpPageIndex = statement.search(/help(\s\d)|h(\s\d)/i);
            if (helpPageIndex != -1) {
                let page = Number.parseInt(statement.substring(helpPageIndex + 5, statement.length)) || Number.parseInt(statement.substring(helpPageIndex + 2, statement.length));
                if (page <= 0 || page > Math.ceil(commands.length/3)) { return; }

                let upperBound = (page * 3)-1;
                let lowerBound = upperBound-2;
                upperBound = Math.min(upperBound, commands.length-1);
                callbacks.push(() => {
                    let s = "";
                    for (let i = lowerBound; i <= upperBound; i++) {
                        s += commands[i].toString() + "<br>";
                    }
                    s += `Page ${page}/${Math.ceil(commands.length/3)}<br>Use help &lt;page&gt; to view other pages.`
                    addToHistory(s);
                })
                return;
            }
            else {
                commands.forEach((command) => {
                    if (command.aliases.includes(statement)) {
                        callbacks.push(command.callback);
                        return;
                    }
                });
            }
        });

        return callbacks;
    }

    class Command {
        aliases: string[];
        usage: string;
        description: string;
        callback: () => void;

        constructor(aliases: string[], usage: string, description: string, callback: () => void) {
            this.aliases = aliases;
            this.usage = usage;
            this.description = description;
            this.callback = callback;
        }

        toString() {
            let s = "<span style='color: var(--pink)'>[";
            this.aliases.forEach((alias) => {
                s += alias + ", "
            })
            s = s.substring(0, s.length-2);
            s += `]</span><br><span style="color: var(--teal)">${this.description}</span><br>`;
            s += `<span style='color: var(--peach)'>Usage: </span><span style="color: var(--lavender)">${this.usage}</span><br>`;

            return s;
        }
    }

    const commands: Command[] = [
        new Command(["help", "h"], "help &lt;page&gt;", "Displays information about available commands.", () => {
            let s = "";
            for (let i = 0; i < 3; i++) {
                s += commands[i].toString() + "<br>";
            }
            s += `Page 1/${Math.ceil(commands.length/3)}<br>Use help &lt;page&gt; to view other pages.`
            addToHistory(s);
        }),
        new Command(["clear", "cls"], "clear", "Clears the terminal.", () => {
            clearHistory();
        }),
        new Command(["welcome"], "welcome", "Displays the welcome message.", () => {
          addToHistory(welcomeMessage);
        }),
        new Command(["contact"], "contact", "Displays Caveat's socials and contact information.", () => {
            addToHistory(
                "<span style='color: var(--pink)'>Email:</span> <a href='mailto:cv@caveat.cc'>cv@caveat.cc</a>" +
                "<br>" +
                "<span style='color: var(--pink)'>Discord:</span> <a href='https://discord.com/users/824400229645418497'>caveat__</a>"
            );
        }),
        new Command(["git"], "git", "Displays Caveat's git accounts and related information.", () => {
           addToHistory(
               "<span style='color: var(--pink)'>Accounts:</span>" +
               "<br>" +
               "<a href='https://codeberg.org/caveat'>https://codeberg.org/caveat</a> (preferred)" +
               "<br>" +
               "<a href='https://github.com/caveat-dev'>https://github.com/caveat-dev</a>" +
               "<br><br>" +
               "<span style='color: var(--pink)'>Public key available at:</span>" +
               "<br>" +
               "<a href='https://caveat.cc/public_key.txt'>https://caveat.cc/public_key.txt</a>"
           )
        }),
        new Command(["bio"], "bio", "Displays Caveat's bio.", () => {
           addToHistory(
               "<span style='word-break: normal; hyphens: auto'>" +
               "Caveat (often stylized as caveat, full name Caveat Emptor) is an amateur developer and FOSS enthusiast " +
               "from North America. They enjoy developing programs in Rust and Haskell, but begrudgingly use Javascript " +
               "the most due to their interest in web development. Watch them develop open-source software that nobody uses!" +
               "</span>"
           )
        }),
        new Command(["syntax"], "syntax", "Displays information on the shell's syntax", () => {
            addToHistory(
                "<span style='color: var(--pink)'>&</span> | Usage: <span style='color: var(--teal)'>Command chaining</span> | Example: <span style='color: var(--lavender)'>bio & git</span>"
            )
        })
    ];
</script>

<link href="https://indieauth.com/auth" rel="authorization_endpoint" style="visibility: hidden">
<a href="https://github.com/caveat-dev" rel="me" target="_blank" style="visibility: hidden;">github.com</a>
<a href="mailto:cv@caveat.cc" rel="me" target="_blank" style="visibility: hidden">cv@caveat.cc</a>

<div bind:this={terminalContainer} class="terminal-container">
    <input bind:this={terminalInput} bind:value={input} class="terminal-input" id="terminal-input" type="text"
        on:keydown={() => {
            typing = true;
        }}

        on:keyup={(e) => {
            if (!e) { return; }

            if (e.key === "Enter") {
                setInputDisplay("", carrotVisible);
                let callbacks = parseInput(input);
                addInputToHistory(input, callbacks.length !== 0);
                if (callbacks.length !== 0) {
                    callbacks.forEach((callback) => {
                        callback();
                    });
                }
                else { addToHistory("Command not found.") }
                input = "";
            }
            else if (e.key === "Delete") {
                input = input.substring(0, input.length-1);
            }
            else {
                input += terminalInput.innerText;
            }

            typing = false;
        }}
    >

    <p bind:this={historyDisplay} class="terminal-history"></p>

    <div class="terminal-fake-input-container">
        <p class="terminal-prompt">></p>
        <p bind:this={inputDisplay} class="terminal-fake-input"><span class="terminal-cursor">▌</span></p>
    </div>
</div>