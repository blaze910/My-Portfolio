const plugins = []; // fetched from your API later

const container = document.getElementById("plugins-container");

if (plugins.length === 0) {
    container.innerHTML = `
        <section class="empty-state">
            <div class="empty-icon">
                <i data-lucide="package-search"></i>
            </div>

            <h2>No Plugins Yet</h2>

            <p>
                There are currently no published plugins.
                Create the first plugin and share it with the community.
            </p>

            <button class="first-plugin-btn">
                <i data-lucide="plus"></i>
                Create Your First Plugin
            </button>
        </section>
    `;

    lucide.createIcons();
} else {
    // Render plugin cards here in the future
}


const lockedView = document.getElementById("locked-view");
const creatorView = document.getElementById("creator-view");

function updateDashboard(){

    const loggedIn = localStorage.getItem("kord_logged_in");

    if(loggedIn){

        lockedView.classList.add("hidden");
        creatorView.classList.remove("hidden");

    }else{

        lockedView.classList.remove("hidden");
        creatorView.classList.add("hidden");

    }

}

updateDashboard();

document
.getElementById("openAuth")
.addEventListener("click",()=>{

    openAuthModal();

});

window.addEventListener("loginSuccess",()=>{

    updateDashboard();

});

const myPluginsView =
document.getElementById("my-plugins-view");

const pluginList =
document.getElementById("pluginList");