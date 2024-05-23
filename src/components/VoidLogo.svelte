<script lang="ts">
    let icon_src = "/void.png";
</script>

<a href="https://caveat.cc/void">
    <img src="{icon_src}" alt="void" width="35px" on:mouseenter={()=>{icon_src = "/altvoid.png"}} on:mouseleave={()=>{icon_src = "/void.png";}}/>
</a>