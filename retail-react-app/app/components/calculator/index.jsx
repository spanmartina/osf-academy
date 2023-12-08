import React, {useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {useLocation} from 'react-router-dom'

// Components
import {
    Box,
    Button,
    HStack,
    Text,
    Container,
    Select
} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Section from '@salesforce/retail-react-app/app/components/section'

//Import directly from chakra ui
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react'

//Hooks
import useEinstein from '@salesforce/retail-react-app/app/hooks/use-einstein'

const Calculator = () => {
    const [number1, setNumber1] = useState(0)
    const [number2, setNumber2] = useState(0)
    const [operation, setOperation] = useState('+')
    const [result, setResult] = useState(0)
    const intl = useIntl()

    const calculateFunction = () => {
        let input1 = Number(number1)
        let input2 = Number(number2)

        switch (operation) {
            case '+':
                setResult(input1 + input2)
                break
            case '-':
                setResult(input1 - input2)
                break
            case '*':
                setResult(input1 * input2)
                break
            case '/':
                setResult(input1 / input2)
                break
            default:
                setResult(0)
        }
    }

    //recalculate each time the input ot operation changes
    useEffect(() => {
        calculateFunction()
    }, [number1, number2, operation])

    //Reset
    const handleClear = () => {
        setNumber1(0)
        setNumber2(0)
        setOperation('+')
        setResult(0)
    }

    return (
        <Section
            padding={4}
            paddingTop={32}
            title={intl.formatMessage({
                defaultMessage: 'Calculator'
            })}
        >
            <Container maxW={'6xl'} marginTop={10}>
                <HStack mt={10} px={30}>
                    <NumberInput value={number1} onChange={(value) => setNumber1(value)}>
                        <NumberInputField style={{'--input-height': '3rem'}} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                    <NumberInput value={number2} onChange={(value) => setNumber2(value)}>
                        <NumberInputField style={{'--input-height': '3rem'}} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                    <Select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        style={{height: 'var(--chakra-sizes-12)'}}
                    >
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                    </Select>
                    <Button onClick={handleClear}>Clear</Button>
                </HStack>
                <Box align={'center'} mt={6}>
                    <Text fontWeight={700} fontSize={20}>
                        {result}
                    </Text>
                </Box>
            </Container>
        </Section>
    )
}

export default Calculator
