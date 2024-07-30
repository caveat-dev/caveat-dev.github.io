<script lang="ts">
    import {onMount} from "svelte";
    import {execute} from "$lib/cash/bin";

    let terminalContainer: HTMLElement;
    let terminalInput: HTMLElement;
    let inputDisplay: HTMLElement;
    let historyDisplay: HTMLElement;

    let input: string = "";

    let typing = false;
    let carrotVisible = true;

    let inputHistory: string[] = [];
    let inputHistoryIndex = 0;

    onMount(() => {
        terminalInput.focus();
        resizeTerminal();
        window.addEventListener('resize', resizeTerminal);

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

        addToHistory(execute("welcome", input, historyDisplay.innerHTML).text || "");
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
        historyDisplay.innerHTML += s;
        fitHistoryToDisplay();
    }

    function addInputToHistory(s: string, success = true) {
        historyDisplay.innerHTML += '<span class="terminal-prompt-history">> </span>';
        if (success) { historyDisplay.innerHTML += `<span class="terminal-history-command-success"">${s}</span>`; }
        else { historyDisplay.innerHTML += `<span class="terminal-history-command-failure"">${s}</span>`; }
        historyDisplay.innerHTML += "<br>"
    }

    function setInputDisplay(s: string, showCarrot: boolean) {
        if (!inputDisplay) { return; }
        inputDisplay.innerHTML = s;
        if (showCarrot) { inputDisplay.innerHTML += "<span class=\"terminal-cursor\">▌</span>"; }
    }

    function handleInput() {
        if (input.trim() === "") {
            addInputToHistory("");
            return;
        }

        let result = execute(input, input, historyDisplay.innerHTML);

        addInputToHistory(input, result.result);
        addToHistory(result.text || "");
        if (result.result) {
            if (result.historyChanged) {
                historyDisplay.innerHTML = result.newHistory || "";
            }
        }

        inputHistory.push(input);
        inputHistoryIndex = inputHistory.length;
        input = "";
    }
</script>

<link href="https://indieauth.com/auth" rel="authorization_endpoint" style="visibility: hidden">
<a href="https://github.com/caveat-dev" rel="me" target="_blank" style="visibility: hidden;">github.com</a>
<a href="mailto:cv@caveat.cc" rel="me" target="_blank" style="visibility: hidden">cv@caveat.cc</a>

<div bind:this={terminalContainer} class="terminal-container">
    <input bind:this={terminalInput} bind:value={input} class="terminal-input" id="terminal-input" type="text"
        on:keydown={(e) => {
            console.log(e);
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
            }

            typing = true;
        }}

        on:keyup={(e) => {
            if (!e) { return; }

            if (e.key === "Enter") {
                setInputDisplay("", carrotVisible);
                handleInput();
            }
            else if (e.key === "Delete") {
                input = input.substring(0, input.length-1);
            }
            else if (e.key === "ArrowUp") {
                if (inputHistoryIndex > 0) { inputHistoryIndex -= 1; }
                input = inputHistory[inputHistoryIndex] || "";
            }
            else if (e.key === "ArrowDown") {
                if (inputHistoryIndex <= inputHistory.length-1) { inputHistoryIndex += 1; }
                input = inputHistory[inputHistoryIndex] || "";
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
