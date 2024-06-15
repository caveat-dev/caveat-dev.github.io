<script>
    import VoidLogo from "../components/VoidLogo.svelte";
    import NeomapLogo from "../components/NeomapLogo.svelte";

    let icon_src = "/favicon.png";
</script>

<title>home | caveat.cc</title>
<div id="content">
    <link href="https://indieauth.com/auth" rel="authorization_endpoint" style="visibility: hidden"/>
    <hr>
    <h2>Git Me:</h2>
    <p>Github: <a href="https://github.com/caveat-dev" rel="me" target="_blank">github.com/caveat-dev</a></p>
    <p>Codeberg: <a href="https://codeberg.org/caveat" target="_blank">codeberg.org/caveat</a></p>
    <h2>Contact:</h2>
    <p>Email: <a href="mailto:cv@caveat.cc" rel="me" target="_blank">cv@caveat.cc</a></p>
    <p>Discord: <a href="https://discord.com/users/824400229645418497" target="_blank">caveat__</a></p>
    <h2>Other sites:</h2>
    <VoidLogo/>
    <NeomapLogo/>
    <h2>Misc:</h2>
    <a href="/public_key.txt" target="_blank">Public Key</a>
    <hr>
</div>
<div class="decsinc">
    <h1><a href="https://roxwize.xyz/ext/decsinc/prev.html?id=1">––</a></h1>
    <a href="https://roxwize.xyz/site/decsinc.html">
        <img alt="decsinc" on:mouseenter={()=>{icon_src = "/alticon.png"}} on:mouseleave={()=>{icon_src = "/favicon.png";}} src="{icon_src}"
             width="35px"/>
    </a>
    <h1><a href="https://roxwize.xyz/ext/decsinc/next.html?id=1">++</a></h1>
</div>
<div id="footer">
    <aside>amateur programming galore!</aside>
</div>

<style>
    .decsinc {
        display: flex;
        align-items: center;
        gap: 1em;
        justify-content: center;
    }
</style>