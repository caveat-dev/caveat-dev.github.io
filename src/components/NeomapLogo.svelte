<script lang="ts">
    let icon_src = "/neomap.png";
</script>

<a href="https://caveat.cc/neomap">
    <img src="{icon_src}" alt="caveat" width="35px" on:mouseenter={()=>{icon_src = "/altneomap.png"}} on:mouseleave={()=>{icon_src = "/neomap.png";}} style="margin-left: 10px; margin-right: 10px"/>
</a>