// ----- Config here! -----

var scriptsToLoad = [
	"components.js",
	"theme.js",

    "fa.js"
];

const debugMode = false

// ----- Add the custom elements to scriptsToLoad -----

const customScripts = document.querySelectorAll("custom-script") 

customScripts.forEach(el => {
    const source = el.getAttribute("src")
    const nSource = source.replace("matematicodoano/js/", "")

    scriptsToLoad.splice(3, 0, nSource)
})

// ----- Loading bar -----

const loadingBar = document.createElement("progress")
loadingBar.max = scriptsToLoad.length
loadingBar.value = 0
loadingBar.classList.add("loading-bar")

document.body.append(loadingBar)

let loadedScripts = 0

// ----- Finish function & page loading -----

function finishLoading() {
	loadingBar.classList.add("is-complete");
	document.documentElement.classList.remove("html-loading")
	console.log("All scripts loaded!")
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
			finishLoading()
		}
	}
	else {
		console.warn(path+" does not have a init function!")
	}
}

async function loadAllScripts() {
	for (const src of scriptsToLoad) {
		await loadScript("matematicodoano/js/" + src)
	}
}


loadAllScripts()