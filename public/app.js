
if(document.querySelector('.middle')){

    const localTime= document.querySelector('.time');
    const localDayDescription= document.querySelector('.date');

    const timezone= localTime.dataset.timezone;

    function calcDateTime(offsetVal){
        var min= offsetVal/60;
        var hour= Math.floor(min/60);
        min-=(hour*60);

        setInterval(function(){
            const nowDate= new Date();

            const dateTimeStr= moment(nowDate).add(hour, 'h').add(min, 'm').subtract(5, 'h').subtract(30, 'm').format('MMMM Do YYYY, h:mm:ss a');

            const date= dateTimeStr.split(',')[0].trim();
            const time= dateTimeStr.split(',')[1].trim();

            localTime.textContent= time;
            localDayDescription.textContent= date;
        }, 1000);
    }

    calcDateTime(timezone);
}

const secMap= document.querySelector('.section-map');

if(secMap){
    const coords= JSON.parse(secMap.dataset.coords);
    const lat= coords.lat; const lon= coords.lon; const city= coords.CITY;

    const mapID = document.getElementById('map');

    const interSectionMap = function (entries, observer) {
        const entry = entries[0];

        if (entry.isIntersecting == true) {
            console.log("Intersected");

            const locations = [
                {
                    coordinates: [lon-1, lat-1],
                    description: city
                },
                {
                    coordinates: [lon, lat],
                    description: city
                },
                {
                    coordinates: [lon+1, lat+1],
                    description: city
                }
            ];

            console.log(locations);

            var map = new maplibregl.Map({
                container: 'map', // that id in which map will be placed
                style: 'https://api.maptiler.com/maps/streets/style.json?key=k9IFWLIKRlgFFrLE2I20', // style of map
                scrollZoom: true // scroll to zoom set to false

            });

            const bounds = new maplibregl.LngLatBounds();

            let idx=0;
            locations.forEach(loc => {
                if(idx==1){
                    // Create marker
                    const el = document.createElement('div'); // create div
                    el.className = 'marker';   // apply pre defined style class named 'marker'

                    // Add marker
                    new maplibregl.Marker({
                        element: el,
                        anchor: 'bottom' // point will be at the bottom of pin (image in 'marker')
                    })
                        .setLngLat(loc.coordinates)
                        .addTo(map);

                    // Add popup
                    new maplibregl.Popup({
                        offset: 30
                    })
                        .setLngLat(loc.coordinates)
                        .setHTML(`<p>${loc.description}</p>`) // what will be written on each of the marker
                        .addTo(map);
                }
                // Extend map bounds to include current location. [OR adjust map zoom to accomodate all location]
                bounds.extend(loc.coordinates);
                idx++;
            });

            map.fitBounds(bounds, {
                // Manual padding (not mandatory, but useful if your map is not completely visible due to styling of your webpage)
                padding: {
                    top: 100,
                    bottom: 100,
                    left: 100,
                    right: 100
                }
            });

            observer.unobserve(entry.target);
        }
    };

    const sectionObserverMap = new IntersectionObserver(interSectionMap, {
        root: null,
        threshold: 0.1, // 0.1 means 10% errorMargin
    });

    sectionObserverMap.observe(mapID);
}