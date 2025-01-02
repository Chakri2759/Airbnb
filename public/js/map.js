if (!singleListing.geometry || !Array.isArray(singleListing.geometry.coordinates) || singleListing.geometry.coordinates.length !== 2) {
    console.error("Invalid coordinates:", singleListing.geometry?.coordinates);
    alert("Invalid location data. Cannot display map.");
} else {
    // Initialize the map
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: singleListing.geometry.coordinates, // Use dynamic coordinates
        zoom: 9
    });

    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(singleListing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${singleListing.title}</h4><p>Exact Location provided after booking</p>`)
        )
        .addTo(map);
}
