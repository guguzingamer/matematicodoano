// ----- Config here! -----
// script.js version: 1.3

var scriptsToLoad = [
	"components.js",
	"theme.js",

    "fa.js"
];

const debugMode = false
const liveServerFriendly = false

// ----- Adds the custom elements to scriptsToLoad -----

const customScripts = document.querySelectorAll("custom-script") 

customScripts.forEach(el => {
    const source = el.getAttribute("src")
    let nSource = source
		.replace("js/", "")

    scriptsToLoad.splice(3, 0, nSource)
})

// ----- JS Loading bar -----

// yk, I didn't wanted this type of loading, but better than nothing

const loadingBar = document.createElement("progress")
loadingBar.max = scriptsToLoad.length
loadingBar.value = 0
loadingBar.classList.add("loading-bar")

document.body.append(loadingBar)

let loadedScripts = 0

// ----- Finish function & page loading -----

async function finishLoading() {
	loadingBar.classList.add("is-complete");
	document.documentElement.classList.remove("html-loading")
	console.log("All scripts loaded!")

	if (liveServerFriendly == true) {
		const links = document.querySelectorAll("a")

		links.forEach(async link => {
			const href = link.getAttribute("href")

			if (href === "") {
				return
			}

			if (!href.includes("www") && !href.includes("https")) {
				link.setAttribute("href", href + ".html")
			}
		})
		console.log("Website is running on Live Server Friendly mode!")
	}
}

// ----- Loading scripts main logic -----

async function loadScript(path) {
	const archive = await import(path)
	
	if (typeof archive.init === "function") {
		await archive.init()
		
		if (debugMode) {
			console.log(path + " loaded!")
		}

		loadedScripts++
		// console.log(loadedScripts)
		
		loadingBar.value = loadedScripts
		if (loadedScripts == scriptsToLoad.length) {
			await finishLoading()
		}
	}
	else {
		console.warn(path+" does not have a init function!")
	}
}

async function loadAllScripts() {
	for (const src of scriptsToLoad) {
		await loadScript("./js/" + src)
	}
}

loadAllScripts()