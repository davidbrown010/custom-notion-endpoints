<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
    

</script>

<div class="container">
    <div class="wrapper">
        {#if data.reaction != null}
            <img src={`https://notion.thebrowns.team/email/reactions/icons/${data.reaction}-reaction.png`} alt={data.reaction + " reaction icon"}>
        {/if}
        <h1>{`Thank you for reacting${data.reaction != null ? " with the " + data.reaction + " emoji" : ""}!`}</h1>
        <p>Kaitlyn and I love hearing your reactions to our updates!  It truly helps us know what we should share with you next! Feel free to close this tab as your reaction has been submitted.</p>
    </div>
</div>

<style lang="scss">
    .container {
        position: absolute;
        inset: 0;
        background-color: #f2f9f8;
        color: #064c4a;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: -3%;
        padding: 0 clamp(30px, 15vw, 200px);

        .wrapper {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width:100%;

            img {
                width: clamp(75px, 10vw, 100px);
                height: clamp(75px, 10vw, 100px);
                padding: 20px;
            }

            h1 {
                font-size: clamp(32px, 5vw, 48px);
            }
            p {
                font-size: clamp(18px, 2vw, 28px);
                font-weight: 300;
            }
        }
    }
</style>

