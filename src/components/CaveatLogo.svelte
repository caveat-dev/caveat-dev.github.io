<script lang="ts">
    let icon_src = "/favicon.png";
</script>

<a href="https://caveat.cc">
    <img src="{icon_src}" alt="caveat" width="35px" on:mouseenter={()=>{icon_src = "/alticon.png"}} on:mouseleave={()=>{icon_src = "/favicon.png";}}/>
</a>