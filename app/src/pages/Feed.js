function Feed() {

    const switchPage = () => (
        window.location.href = "/groups"
    )

    return (
        <div>
            <h1>Feed</h1>
            <button
              onClick={() => switchPage()}
            >pages</button>
        </div>
    )

}
export default Feed;
