<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import type Post from "./types/posts";

  export let post: Post;
  import folder from "./stores/folder";
  import { createEventDispatcher } from "svelte";
  import { searchSettings } from "./stores/search";

  const dispatch = createEventDispatcher();

  async function saveFile() {
    const file_ext = post.file_url.split(".").reverse().shift();

    await invoke("download", {
      url: post.file_url,
      tags: post.tags.split(" ").join(", "),
      path: `${$folder}\\${$searchSettings.site} - ${post.id}.${post.file_ext ?? file_ext}`,
      saveTags: `${$searchSettings.save_tags}`
    });
  }

  async function Kappa() {
    const data = await fetch(post.preview_url, {
      mode: "no-cors",
    });
    const blob = await data.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  }
</script>

<div
  class="flex flex-row justify-center border border-black h-full m-2 rounded-md cursor-pointer"
  on:click={() => {
    dispatch("post-click", post);
    Kappa();
  }}
>
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
