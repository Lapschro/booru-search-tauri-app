<script>
  import { createEventDispatcher } from "svelte";
  import { open } from "@tauri-apps/api/dialog";
  import folder from "./stores/folder";
  import searchStore, { providers } from "./stores/search.js";

  let tags = "";

  const { searchSettings } = searchStore;

  console.log(searchStore);

  const dispatch = createEventDispatcher();

  function searchTags() {
    dispatch("onSearch", {
      tags: tags.split(" ").join("+"),
      size: 30,
      reset: true,
    });
  }

  async function changefolder() {
    let res = await open({
      directory: true,
    });

    if (typeof res === "string") {
      folder.set(res);
    } else {
      folder.set(res[0] ?? "");
    }
  }

  function changeProvider(provider) {
    searchSettings.set({ ...$searchSettings, site: provider.target.value });
  }
</script>

<div class="header">
  <label for="tags" class="mr-1">Tags: </label>
  <input
    type="text"
    name="tags"
    id="tags"
    bind:value={tags}
    placeholder="Insert tags"
    class="border border-gray-900 px-2 mr-2"
    on:submit={searchTags}
    on:keyup={(e) => {
      if ((e.code || e.key) == "Enter") {
        searchTags();
      }
    }}
  />
  <div class="spacing" />
  <select
    name="site"
    id="site"
    on:change={changeProvider}
    class="border border-black px-2 mr-4"
  >
    {#each providers as provider}
      <option value={provider}>{provider}</option>
    {/each}
  </select>
  <button
    type="button"
    value="Search"
    on:click={() => {
      searchTags();
    }}
    class="border border-gray-900 px-4 mr-2"
  >
    Search
  </button>
  <div class="spacing" />
  <button
    class="border border-gray-900 px-4 mr-2"
    type="button"
    name="folder"
    id="folder"
    value="Select folder"
    on:click={changefolder}
  >
    Select folder
  </button>
  <label for="folder">{$folder}</label>
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    height: min(100%, 1.5rem);
    width: 100%;
  }
  .spacing {
    width: 5px;
  }
</style>
