export async function init() {

    const themeOptions = [
        "light",
        "dark"
    ]

    function getTheme() {
        let theme = localStorage.getItem("theme")

        if (themeOptions.includes(theme)) {
            return theme
        }

        return "light"
    }

    function applyTheme(theme) {
        localStorage.setItem("theme", theme)
        document.documentElement.setAttribute("data-theme", theme)
    }


    function changeTheme() {
        const theme = getTheme()

        if (theme === "light") {
            applyTheme("dark")
        }
        else {
            applyTheme("light")
        }

        window.dispatchEvent(new Event("theme-changed"))
    }

    function checkTheme() {
        const theme = getTheme()
        document.documentElement.setAttribute("data-theme", theme)
    }
    
    checkTheme()

    const button = document.querySelector("#change-theme")
    button.addEventListener("click", () => {
        changeTheme()
    })
}