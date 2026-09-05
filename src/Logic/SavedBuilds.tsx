export function SavedBuilds() {
    // Checking Local storage and if it exists use it or set it to null.
    const [builds, setBuilds] = useState({const builds = localStorage.getItem('builds');
    return builds ? JSON.parse(builds) : null
})

    const handleSavedBuilds = () =>
        const saveBuild = localStorage.setItem("builds")




    return (
        <button onClick={}>

        </button>
    )
}
