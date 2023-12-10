import React, {useState, useEffect} from 'react'

// Components
import {
    Box,
    Button,
    Text,
    Container,
    Input,
    HStack,
    Image,
    Heading
} from '@salesforce/retail-react-app/app/components/shared/ui'
import apiKey from '@salesforce/retail-react-app/app/pages/weather/apiKey'

const WeatherApp = () => {
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [weather, setWeather] = useState({description: '', temeparture: '', icon: '', color: ''})
    const [weatherData, setWeatherData] = useState(null)

    const fetchData = async () => {
        if (city.trim() === '') {
            alert('Please enter a city')
            return
        }
        setLoading(true)

        try {
            const response = await fetch(
                `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
            )
            if (response.ok) {
                const data = await response.json()
                setWeatherData(data)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching data: ', error)
            setLoading(false)
        }
    }

    const formatResponse = () => {
        if (!weatherData) return null

        const description = weatherData.weather[0].description
        const temperature = (weatherData.main.temp - 273.15).toFixed(1)
        const icon = weatherData.weather[0].icon
        let message, color
        const weatherType = weatherData.weather[0].main.toLowerCase()
        // Set background color based on weather type
        switch (weatherType) {
            case 'clear':
                color = 'blue.50'
                break
            case 'clouds':
                color = 'gray.200'
                break
            case 'rain':
                color = 'blue.500'
                break
            case 'snow':
                color = 'whiteAlpha.100'
                break
            default:
                color = '' // Default background color
        }

        // Check if the description is only one word
        const isSingleWord = description.split(' ').length === 1
        switch (true) {
            case description.includes('clouds') && isSingleWord:
                message = `It's cloudy in ${city}.`
                break
            case description.includes('scattered clouds'):
                message = `Scattered clouds in ${city}.`
                break

            case description.includes('broken clouds'):
                message = `Broken clouds in ${city}.`
                break
            case description.includes('sunny') || (description.includes('clear') && isSingleWord):
                message = `It's ${description} in ${weatherData.name}.`
                break
            case description.includes('light rain') ||
                description.includes('moderate rain') ||
                description.includes('overcast clouds'):
                message = `The weather in ${weatherData.name} is ${description}.`
                break
            case description.includes('rain') && isSingleWord:
                message = `It's raining in ${weatherData.name}.`
                break
            case description.includes('fog') ||
                description.includes('mist') ||
                description.includes('snow') ||
                description.includes('thunderstorm'):
                message = `${weatherData.weather[0].main} expected in ${weatherData.name}.`
                break
            default:
                message = `No match for: ${description}`
                break
        }

        setWeather({description: message, temperature, icon, color})
    }

    useEffect(() => {
        formatResponse()
    }, [weatherData])

    const handleSearch = () => {
        fetchData()
    }

    return (
        <Box marginTop={10}>
            <Container maxW={'6xl'} marginTop={4}>
                <Heading size="3md" marginBottom={4}>
                    Weather App
                </Heading>
                <HStack>
                    <Input
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value)
                            setLoading(true)
                        }}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </HStack>
                {loading && <Text id="loading">Loading...</Text>}
            </Container>
            {weather.description && (
                <Container maxW={'6xl'}>
                    <Container background={weather.color}>
                        {weather.icon && (
                            <Image
                                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                alt="Weather Icon"
                            />
                        )}
                        <Text>{weather.description}</Text>
                        <Text>{`The temperature is ${weather.temperature}°C`}</Text>
                    </Container>
                </Container>
            )}
        </Box>
    )
}

WeatherApp.getTemplateName = () => 'weather-app'

export default WeatherApp
