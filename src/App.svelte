<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import Header from "./lib/Header.svelte";
  import SearchContent from "./lib/SearchContent.svelte";
  import { searchSettings, searchProvider } from "./lib/stores/search";
  import folder from "./lib/stores/folder";

  let route = "home";

  let loading = false;
  let data: any = {};

  let page = 1;
  let search: any;

  let zoom: any = null;
  let base64data = null;

  window.onscroll = function (ev) {
    if (
      window.innerHeight + Math.round(window.scrollY) >=
      document.body.offsetHeight
    ) {
      Search({ detail: search });
    }
  };

  async function saveFile() {
    const file_ext = zoom.file_url.split(".").reverse().shift();
    console.log($searchSettings.save_tags);
    
    await invoke("download", {
      url: zoom.file_url,
      tags: zoom.tags.split(" ").join(", "),
      path: `${$folder}\\${$searchSettings.site} - ${zoom.id}.${zoom.file_ext ?? file_ext}`,
      saveTags : `${$searchSettings.save_tags}`
    });
  }
  async function Search({ detail }) {
    if (!loading) {
      loading = true;
      if (detail.reset) {
        page = 1;
      }

      search = detail;

      search.reset = false;

      try {
        let res = await $searchProvider.fetchPage(detail.tags, page++, 30);
        let newSet = data;
        if (page == 1) {
          newSet = new Map<string, any>();
        }

        const json = res;

        for (let i in Object.values(json)) {
          newSet[json[i].id] = json[i];
        }

        data = { ...newSet };
        console.log(data);
      } catch {}
      loading = false;
    }
  }

  const saved_posts = invoke("get_posts").then((res) => {
    console.log(res);
  });
  console.log(zoom);

  $: {
    console.log($searchSettings);
    data = {};
    page = 1;
    loading = false;
  }

  $: getPosts = () => {
    console.log(Object.values(data).sort((x: any) => -x.id));
    console.log("updating data!");

    return Object.values(data).sort((x: any) => -x.id);
  };
</script>

<main>
  <div class="w-full">
    <div class="header">
      <Header on:onSearch={Search} />
    </div>
    {#if route == "home"}
      <SearchContent
        posts={getPosts()}
        on:post-click={(post) => {
          zoom = post.detail;
          console.log(zoom);
        }}
      />
    {/if}
    {#if zoom != null}
      <dialog open class="fixed top-0 left-0 w-full h-full">
        <div class="p-10 flex flex-col w-full h-full overflow-scroll">
          <div class="p-2 flex flex-row gap-2">
            <img
              src={zoom.sample_url}
              alt={zoom.tags}
              class="flex-[2] max-h-[100vh] object-contain"
              on:click={() => {
                zoom = null;
              }}
              on:contextmenu|preventDefault|stopPropagation={saveFile}
            />
            <div class="bg-black h-full w-[1px]"></div>
            <div class="flex-[1] flex flex-row gap-2 flex-wrap">
              {#each zoom.tags as tag}
                {tag}
              {/each}
            </div>
          </div>
        </div>
      </dialog>
    {/if}
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 5px;
    height: max(10%, 2ch);
  }
</style>
