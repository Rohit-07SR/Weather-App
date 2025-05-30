import { useState } from 'react';
import './App.css';
import clearimg from './assets/clear.png';
import cloudimg from './assets/cloud.png';
import drizzleimg from './assets/drizzle.png';
import humdidtyimg from './assets/humidity.png';
import rainimg from './assets/rain.png';
import snowimg from './assets/snow.png';
import windimg from './assets/wind.png';
import { FaSearch } from "react-icons/fa";


const WeatherDetails = ({ icon, temp, city, country, lat, long, wind, humdidty }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="clearsky" />
      </div>
      <div className='botctrl'>
        <div className='temp'>{temp}°C</div>
        <div className='location'>{city}</div>
        <div className='country'>{country}</div>
      </div>
      <div className='cord'>
        <div>
          <span className="lati">Latitude </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="longi">Longitude </span>
          <span>{long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humdidtyimg} alt="humidity" className='icon' />
          <div className='data'>
            <div className="humidity-percent">{humdidty}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windimg} alt="wind" className='icon' />
          <div className='data'>
            <div className="humidity-percent">{wind} kmph</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>

    </>
  )
}



function App() {
  let apikey = "173c79983d34656d5d4cc6abfac4dd42"
  const [text, setText] = useState()
  const [icon, setIcon] = useState(clearimg)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("City")
  const [country, setCountry] = useState("Country")
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [wind, setWind] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const weatherIconMap = {
    "01d": clearimg,
    "01n": clearimg,
    "02d": cloudimg,
    "02n": cloudimg,
    "03d": drizzleimg,
    "03n": drizzleimg,
    "04d": drizzleimg,
    "04n": drizzleimg,
    "09d": rainimg,
    "09n": rainimg,
    "10d": rainimg,
    "10n": rainimg,
    "13d": snowimg,
    "13n": snowimg,

  }

  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`


    try {
      let res = await fetch(url)
      let data = await res.json()
      //console.log(data)
      if (data.cod === "404") {
        console.error("City not found")
        setCityNotFound(true)
        setLoading(false)
        return
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLong(data.coord.lon)
      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || clearimg)
      setCityNotFound(false)
    } catch (error) {
      console.error("An error occured:", error.message)
      setError("An error occured while fetching weather data.")
    } finally {
      setLoading(false)
    }
  }
  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  // useEffect(() => {
  //   search()
  // }, [])

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          className='cityinput'
          type="text"
          placeholder='Search City'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className='search-icon'
          onClick={() => search()}
        >
          <FaSearch />
        </div>
      </div>


      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}
      {!loading && !cityNotFound && <WeatherDetails
        icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        long={long}
        wind={wind}
        humdidty={humidity}
      />}

     
    </div>

  );
}

export default App;
