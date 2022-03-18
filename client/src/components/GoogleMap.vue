<template>
  <div class="map">
    <h1>Google Map - Point of Interest</h1>
    <button @click="chiduong()">Click</button>
    <GmapAutocomplete @place_changed="setPlace" />
    <span>Chọn thành phố</span>

    <select v-model="selectedCity" @change="onCityChange($event)">
      <option
        v-for="(city, index) in cityInfo"
        v-bind:value="city.value"
        v-bind:key="index"
      >
        {{ city.name }}
      </option>
    </select>
    <span>Chọn loại địa điểm</span>

    <select v-model="typeOfPlace" @change="onPlaceTypeChange($event)">
      <option
        v-for="(place, index) in placeInfo"
        v-bind:value="place.type"
        v-bind:key="index"
      >
        {{ place.name }}
      </option>
    </select>
    <p v-if="!loadMap">Loading map...</p>
    <GmapMap
      v-if="loadMap"
      :center="{ lat: this.position.lat, lng: this.position.lng }"
      :zoom="16"
      map-type-id="hybrid"
      style="width: 99vw; height: 550px"
    >
      <DirectionsRenderer
        travelMode="DRIVING"
        :origin="position"
        :destination="endLocation"
      />
      <GmapMarker
        :key="this.position.lng"
        :position="this.position"
        :clickable="true"
        :draggable="true"
        @click="center = this.position"
      />
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m"
        @click="directions(m)"
      />
    </GmapMap>
  </div>
</template>

<script>
import axios from "axios";
import DirectionsRenderer from "./DirectionsRenderer";

export default {
  name: "GoogleMap",
  components: { DirectionsRenderer },
  props: {
    msg: String,
  },
  data() {
    return {
      // startLocation: {
      //   lat: 10.0299337,
      //   lng: 105.7706153,
      // },
      endLocation: null,
      markers: [],
      typeOfPlace: "",
      loadMap: false,
      location: null,
      gettingLocation: false,
      errorStr: null,
      position: {
        lat: 0,
        lng: 0,
      },
      cityInfo: [
        {
          name: "Cần Thơ",
          value: "cantho",
          position: {
            lat: 10.03711,
            lng: 105.78825,
          },
        },
        {
          name: "Hồ Chí Minh",
          value: "hochiminh",
          position: {
            lat: 10.82302,
            lng: 106.62965,
          },
        },
        {
          name: "Hà Nội",
          value: "hanoi",
          position: {
            lat: 21.0245,
            lng: 105.84117,
          },
        },
        {
          name: "Đà Nẵng",
          value: "danang",
          position: {
            lat: 16.06778,
            lng: 108.22083,
          },
        },
      ],
      placeInfo: [
        {
          type: "school",
          name: "Trường học",
        },
        {
          type: "hotel",
          name: "Khách sạn",
        },
        {
          type: "restaurant",
          name: "Nhà hàng",
        },
        {
          type: "amt",
          name: "Cây ATM",
        },
      ],
      selectedCity: "cantho",
    };
  },
  methods: {
    directions(destination) {
      console.log(destination);

      this.endLocation = {
        lat: destination.lat,
        lng: destination.lng,
      };
    },

    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not available."));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    async locateMe() {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.position.lat = this.location.coords.latitude;
        this.position.lng = this.location.coords.longitude;
        this.loadMap = true;
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },
    getCurrentPosition() {
      const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.position.lat = latitude;
        this.position.lng = longitude;
        // Do something with the position
      };

      const error = (err) => {
        console.log(err);
      };
      // This will open permission popup
      navigator.geolocation.getCurrentPosition(success, error);
    },

    onCityChange(event) {
      this.selectedCity = event.target.value;
      console.log(event.target.value);
      let citySelected = this.cityInfo.find(
        (city) => city.value === this.selectedCity
      );

      this.position.lat = citySelected.position.lat;
      this.position.lng = citySelected.position.lng;
    },
    onPlaceTypeChange(event) {
      console.log(event.target.value);
      axios
        .get(
          `https://places.sit.ls.hereapi.com/places/v1/discover/search?apikey=Y3lgBBhn3TgZ1IeXplemk9SdhSTg9V6KlbL0Mh3SEBE&at=${this.position.lat},${this.position.lng}&q=${this.typeOfPlace}&pretty`
        )
        .then((response) => {
          console.log(response);
          const newResponse = JSON.parse(JSON.stringify(response));
          newResponse.data.results.items.forEach((value) => {
            var position = {
              lat: value.position[0],
              lng: value.position[1],
            };
            this.markers.push(position);
          });

          console.log(this.markers);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    setPlace(place) {
      console.log("lat: ", place.geometry.location.lat());
      console.log("lng: ", place.geometry.location.lng());
    },
  },
  created() {
    this.locateMe();
    console.log(this.markers);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
