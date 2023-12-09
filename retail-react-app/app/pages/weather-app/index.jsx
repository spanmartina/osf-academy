import React, {useState, useEffect} from 'react'

// Components
import {
    Box,
    Button,
    Text,
    Container,
    Section,
    Input,
    HStack,
    Form
} from '@salesforce/retail-react-app/app/components/shared/ui'

import apiKey from '@salesforce/retail-react-app/apiKey'

const WeatherApp = () => {
    // const [city, setCity] = useState('')
    // const [weather, setWeather] = useState(null)
    // let cityCode

    // const fetchCityId = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://api.openweathermap.org/data/2.5/find?q=${city}&appid=${apiKey}`
    //             // `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid={${apiKey}}`
    //         )
    //         const data = await response.json()
    //         console.log(data)
    //         setWeather(data)
    //         // console.log(response.data)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // // const key = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={${apiKey}}`
    // const fetchData = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${apiKey}`
    //             // `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid={${apiKey}}`
    //         )
    //         const data = await response.json()
    //         console.log(data)
    //         setWeather(data)
    //         // console.log(response.data)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // // useEffect(() => {
    // //     fetchData()
    // // }, [])

    // const handleSearch = (e) => {}
    return (
        <h2>Hello</h2>
        // <Box marginTop={10}>
        //     {/* <Box data-testid="weather-app" layerStyle="page"> */}
        //     {/* <Section padding={4} paddingTop={32}> */}
        //     <Container maxW={'6xl'} marginTop={8}>
        //         <Text>Weather App</Text>
        //         {/* <Form onSubmit={fetchData}> */}
        //         {/* <Form> */}
        //         <HStack>
        //             <Input value={city} onChange={(e) => setCity(e.target.value)} />
        //             <Button>Search</Button>
        //         </HStack>
        //         {/* </Form> */}
        //     </Container>
        //     <Container maxW={'6xl'}>
        //         <Icon />
        //         <Text>The weather in City is sunny</Text>
        //         <Text>The temperature is 11.4C</Text>
        //     </Container>
        //     {/* </Section> */}
        // </Box>
    )
}

WeatherApp.getTemplateName = () => 'weather-app'
export default WeatherApp
