<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import type Post from "./types/posts";

  export let post: Post;
  import folder from "./stores/folder";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  async function saveFile() {
    await invoke("download", {
      url: post.file_url,
      tags: post.tags,
      path: `${$folder}\\yande.re - ${post.id} ${post.tags}.${post.file_ext}`,
    });
  }
  
  const save_post = ()=> {
    invoke("save_post", {content : JSON.stringify(post)})
  }
</script>

<div class="flex flex-row justify-center border border-black h-full m-2 " on:click={()=>{
  dispatch("post-click", post);
}}>
  <img
    class="image self-center"
    src={post.preview_url}
    alt={post.tags}
    
    on:contextmenu|preventDefault|stopPropagation={saveFile}
  />
</div>

<style>
  .image {
    max-width: 100%;
    max-height: 100%;
  }
</style>

