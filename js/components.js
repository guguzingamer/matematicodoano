async function loadAllComponents(list) {
    await Promise.all(
        list.map(async item => {
            const path = ("/components/"+item+".html")

            const response = await fetch(path)

            if (!response.ok) {
                console.warn("Component " + item + "could not be loaded!")
                return
            }

            const html = await response.text();

            const target = document.querySelector(item)
            target.innerHTML = html
        })
    )
}

export async function init() {
    const componentsList = [
        "header",
        "footer"
    ]

    await loadAllComponents(componentsList)
}