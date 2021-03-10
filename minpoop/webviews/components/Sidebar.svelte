<script lang="ts">
    import {onMount} from 'svelte'
    import type { User } from '../types';
    import Todos from "./Todos.svelte";
    
    let loading = true;
    let user : User | null = null;
    let accessToken = '';
    onMount(async ()=>{
        window.addEventListener('message', async (event) => {
        const message = event.data; // The json data that the extension sent
        
        switch (message.type) {
                case 'token' : 
                    accessToken = message.value;
                    const response = await fetch(`${apiBaseUrl}/me`,{
                        headers: {
                            authorization : `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json()
                    user = data.user;
                    loading = false;
            }
        });

        tsvscode.postMessage({type: "get-token", value: undefined});
    })
</script>



{#if loading}
    <div>loading...</div>
{:else if user}
    <pre>{JSON.stringify(user,null,2)}</pre>
    <Todos {user} {accessToken}/>
    <button on:click={()=>{
        accessToken= ' '
        user = null
        tsvscode.postMessage({ type: "logout", value: undefined})
    }}>logout</button>
{:else}
    <button on:click={()=>{
        tsvscode.postMessage({type: "authenticate", value: undefined});
    }}>login with Github</button>
{/if}

