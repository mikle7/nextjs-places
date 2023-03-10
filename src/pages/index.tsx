import { type NextPage } from "next";
import Head from "next/head";
import Script from "next/script";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD1ejZgwjj-xj4xsxFA8zVgZirFFTL6KEI&libraries=places&callback=initMap" />
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-2 lg:w-2/3">
          <div id="map" className="h-96 w-full" />
          <div id="place-id" className="h-96 w-full" />
          <div id="places" className="h-24 w-full" />
        </div>
      </main>
    </>
  );
};

export default Home;

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap(): void {
  // Create the map.
  const pyrmont = { lat: -33.866, lng: 151.196 };
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: pyrmont,
      zoom: 17,
      mapId: "8d193001f940fde3",
    } as google.maps.MapOptions
  );

  // Create the places service.
  const service = new google.maps.places.PlacesService(map);

  service.getDetails(
    { placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4" },
    (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById("place-id")!.textContent =
          JSON.stringify(place);
        console.log("PLACE INFO", place);
      }
    }
  );
  let getNextPage: () => void | false;

  // Perform a nearby search.
  service.nearbySearch(
    { location: pyrmont, radius: 500, type: "store" },
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus,
      pagination: google.maps.places.PlaceSearchPagination | null
    ) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);

      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
}

function addPlaces(
  places: google.maps.places.PlaceResult[],
  map: google.maps.Map
) {
  const placesList = document.getElementById("places") as HTMLElement;

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon!,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      new google.maps.Marker({
        map,
        icon: image,
        title: place.name!,
        position: place.geometry.location,
      });

      const li = document.createElement("li");

      li.textContent = place.name!;
      placesList.appendChild(li);

      li.addEventListener("click", () => {
        map.setCenter(place.geometry!.location!);
      });
    }
  }
}
declare global {
  interface Window {
    initMap: () => void;
  }
}

if (typeof window !== "undefined") {
  window.initMap = initMap;
}
