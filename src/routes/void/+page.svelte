<script lang="ts">
    import {onMount} from "svelte";

    let url = "https://void.caveat.cc"

    onMount(() => {
        window.location.href = url;
    })
</script>

<body id="body">
        <h1>Redirecting to <a href="{url}">https://void.caveat.cc</a>...</h1>
</body>