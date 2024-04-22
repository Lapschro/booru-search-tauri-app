<script>
  import Post from "./Post.svelte";

  export let posts = []

  console.log(posts)
</script>

<style>
    .content{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        row-gap: 10px;
        
    }

    .content{
        @media screen and (min-width: 500px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media screen and (min-width: 900px) {
            grid-template-columns: repeat(4, 1fr);
        }
    }
</style>

<div class="content gap-2">
    {#if posts.length > 0 }
        {#each posts as post (post.id) }
            <Post post={post} on:post-click></Post>
        {/each}
    {:else}
        <div>
            Empty data
        </div>
    {/if}
</div>