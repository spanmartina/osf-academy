/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState, useRef} from 'react'
import {useIntl, FormattedMessage} from 'react-intl'
import {useLocation} from 'react-router-dom'

// Components
import {
    Box,
    Button,
    SimpleGrid,
    HStack,
    VStack,
    Text,
    Flex,
    Stack,
    Container,
    Link,
    Input
} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Hero from '@salesforce/retail-react-app/app/components/hero'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import Section from '@salesforce/retail-react-app/app/components/section'
import ProductScroller from '@salesforce/retail-react-app/app/components/product-scroller'

// Others
import {getAssetUrl} from '@salesforce/pwa-kit-react-sdk/ssr/universal/utils'
import {heroFeatures, features} from '@salesforce/retail-react-app/app/pages/home/data'

//Hooks
import useEinstein from '@salesforce/retail-react-app/app/hooks/use-einstein'

// Constants
import {
    MAX_CACHE_AGE,
    HOME_SHOP_PRODUCTS_CATEGORY_ID,
    HOME_SHOP_PRODUCTS_LIMIT
} from '@salesforce/retail-react-app/app/constants'
import {useServerContext} from '@salesforce/pwa-kit-react-sdk/ssr/universal/hooks'
import {useProductSearch} from '@salesforce/commerce-sdk-react'
import {useCommerceApi, useAccessToken} from '@salesforce/commerce-sdk-react'
/**
 * This is the home page for Retail React App.
 * The page is created for demonstration purposes.
 * The page renders SEO metadata and a few promotion
 * categories and products, data is from local file.
 */
const Home = () => {
    const intl = useIntl()
    const einstein = useEinstein()
    const {pathname} = useLocation()
    const api = useCommerceApi()
    const {getTokenWhenReady} = useAccessToken()

    const {res} = useServerContext()
    if (res) {
        res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    }

    const [inputFields, setInputFields] = useState([''])
    // State for managing product search result
    const [productSearchResult, setProductSearchResult] = useState({
        data: {
            hits: []
        },
        isLoading: true
    })

    // Fetch initial products
    const {data: initialProductSearchResult, isLoading: initialLoading} = useProductSearch({
        parameters: {
            refine: [`cgid=${HOME_SHOP_PRODUCTS_CATEGORY_ID}`, 'htype=master'],
            limit: HOME_SHOP_PRODUCTS_LIMIT
        }
    })

    useEffect(() => {
        // Update state with the initial products
        setProductSearchResult(() => ({
            data: {
                hits: initialProductSearchResult?.hits || []
            },
            isLoading: initialLoading
        }))
    }, []) // No dependencies to ensure the effect only runs once after the initial render

    const fetchProducts = async (productIds) => {
        // If there is no id: fetch intial data
        if (!productIds?.length) {
            setProductSearchResult(() => ({
                data: {
                    hits: initialProductSearchResult?.hits || []
                },
                isLoading: initialLoading
            }))
        } else {
            try {
                const token = await getTokenWhenReady()
                const products = await api.shopperProducts.getProducts({
                    parameters: {ids: productIds.join(',')},
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Products', products)
                if (products && products.total > 0) {
                    //Format response data to have access to the images
                    const formattedProducts = {
                        data: {
                            hits: products.data.map((product) => ({
                                ...product, // Copy all properties from the fetched product
                                image: {
                                    alt: product.imageGroups[0].images[0].alt,
                                    disBaseLink: product.imageGroups[0].images[0].disBaseLink,
                                    link: product.imageGroups[0].images[0].link,
                                    title: product.imageGroups[0].images[0].title
                                }
                            }))
                        },
                        isLoading: false
                    }
                    console.log('formattedProducts', formattedProducts)

                    return formattedProducts
                } else {
                    // Handle the case when products is undefined
                    console.log('No products fetched')
                    const noProducts = {
                        data: {
                            hits: []
                        },
                        isLoading: false
                    }
                    return noProducts
                }
            } catch (error) {
                console.error('Error fetching products:', error)
                throw error
            }
        }
    }

    console.log('Produs search', productSearchResult)

    //Handle product id fetch when "Get Product" button is clicked
    const handleGetProduct = async () => {
        const productIds = inputFields.filter((field) => field.trim() !== '')

        try {
            // Update loading state
            setProductSearchResult((prev) => ({...prev, isLoading: true}))

            const fetchedProducts = await fetchProducts(productIds)

            if (fetchedProducts) {
                // Process the fetched products and update state
                setProductSearchResult({
                    data: {
                        hits: fetchedProducts.data?.hits
                    },
                    isLoading: false
                })
            }
        } catch (error) {
            console.error('Error handling fetched products:', error)
        }
    }

    const handleRemoveProduct = (index) => {
        const newInputFields = [...inputFields]
        newInputFields.splice(index, 1)
        setInputFields(newInputFields)
    }

    const handleAddField = () => {
        // Check if input fields are empty
        const isAnyFieldEmpty = inputFields.some((field) => field === '')

        if (!isAnyFieldEmpty) {
            setInputFields([...inputFields, ''])
        }
    }

    const handleInputChange = (index, value) => {
        const newInputFields = [...inputFields]
        newInputFields[index] = value
        setInputFields(newInputFields)
    }

    const isAddFieldDisabled = inputFields.some((field) => field === '') // Check if any field is empty
    /**************** Einstein ****************/
    useEffect(() => {
        einstein.sendViewPage(pathname)
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page">
            <Seo
                title="Home Page"
                description="Commerce Cloud Retail React App"
                keywords="Commerce Cloud, Retail React App, React Storefront"
            />

            <Hero
                title={intl.formatMessage({
                    defaultMessage: 'The React PWA Starter Store for Retail',
                    id: 'home.title.react_starter_store'
                })}
                img={{
                    src: getAssetUrl('static/img/hero.png'),
                    alt: 'npx pwa-kit-create-app'
                }}
                actions={
                    <Stack spacing={{base: 4, sm: 6}} direction={{base: 'column', sm: 'row'}}>
                        <Button
                            as={Link}
                            href="https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/getting-started.html"
                            target="_blank"
                            width={{base: 'full', md: 'inherit'}}
                            paddingX={7}
                            _hover={{textDecoration: 'none'}}
                        >
                            <FormattedMessage
                                defaultMessage="Get started"
                                id="home.link.get_started"
                            />
                        </Button>
                    </Stack>
                }
            />

            <Section
                background={'gray.50'}
                marginX="auto"
                paddingY={{base: 8, md: 16}}
                paddingX={{base: 4, md: 8}}
                borderRadius="base"
                width={{base: '100vw', md: 'inherit'}}
                position={{base: 'relative', md: 'inherit'}}
                left={{base: '50%', md: 'inherit'}}
                right={{base: '50%', md: 'inherit'}}
                marginLeft={{base: '-50vw', md: 'auto'}}
                marginRight={{base: '-50vw', md: 'auto'}}
            >
                <SimpleGrid
                    columns={{base: 1, md: 1, lg: 3}}
                    spacingX={{base: 1, md: 4}}
                    spacingY={{base: 4, md: 14}}
                >
                    {heroFeatures.map((feature, index) => {
                        const featureMessage = feature.message
                        return (
                            <Box
                                key={index}
                                background={'white'}
                                boxShadow={'0px 2px 2px rgba(0, 0, 0, 0.1)'}
                                borderRadius={'4px'}
                            >
                                <Link target="_blank" href={feature.href}>
                                    <HStack>
                                        <Flex
                                            paddingLeft={6}
                                            height={24}
                                            align={'center'}
                                            justify={'center'}
                                        >
                                            {feature.icon}
                                        </Flex>
                                        <Text fontWeight="700">
                                            {intl.formatMessage(featureMessage.title)}
                                        </Text>
                                    </HStack>
                                </Link>
                            </Box>
                        )
                    })}
                </SimpleGrid>
            </Section>

            {productSearchResult && (
                <Section
                    padding={4}
                    paddingTop={16}
                    title={intl.formatMessage({
                        defaultMessage: 'Shop Products',
                        id: 'home.heading.shop_products'
                    })}
                    subtitle={intl.formatMessage(
                        {
                            defaultMessage:
                                'This section contains content from the catalog. {docLink} on how to replace it.',
                            id: 'home.description.shop_products',
                            description:
                                '{docLink} is a html button that links the user to https://sfdc.co/business-manager-manage-catalogs'
                        },
                        {
                            docLink: (
                                <Link
                                    target="_blank"
                                    href={'https://sfdc.co/business-manager-manage-catalogs'}
                                    textDecoration={'none'}
                                    position={'relative'}
                                    _after={{
                                        position: 'absolute',
                                        content: `""`,
                                        height: '2px',
                                        bottom: '-2px',
                                        margin: '0 auto',
                                        left: 0,
                                        right: 0,
                                        background: 'gray.700'
                                    }}
                                    _hover={{textDecoration: 'none'}}
                                >
                                    {intl.formatMessage({
                                        defaultMessage: 'Read docs',
                                        id: 'home.link.read_docs'
                                    })}
                                </Link>
                            )
                        }
                    )}
                >
                    <Box pt={8}>
                        {inputFields.map((value, index) => (
                            <Flex key={index} align="center" marginBottom={4}>
                                <Input
                                    type="text"
                                    placeholder="Enter Product ID"
                                    value={value}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    flex={1}
                                    marginRight={2}
                                />
                                <Button onClick={() => handleRemoveProduct(index)} ml={4}>
                                    Remove
                                </Button>
                            </Flex>
                        ))}
                        <Button
                            onClick={handleAddField}
                            mt={4}
                            width="full"
                            isDisabled={isAddFieldDisabled}
                        >
                            Add Field
                        </Button>
                        <Button onClick={handleGetProduct} mt={4} width="full">
                            Get Product
                        </Button>
                    </Box>
                    {!productSearchResult.data.hits.length && !productSearchResult.isLoading && (
                        <Box mt={8} p={4} textAlign="center">
                            <Text fontWeight={700} color={'red.500'}>
                                No Products Found.
                            </Text>
                        </Box>
                    )}
                    <Stack pt={8} spacing={16}>
                        <ProductScroller
                            products={productSearchResult?.data?.hits}
                            isLoading={productSearchResult.isLoading}
                        />
                    </Stack>
                </Section>
            )}

            <Section
                padding={4}
                paddingTop={32}
                title={intl.formatMessage({
                    defaultMessage: 'Features',
                    id: 'home.heading.features'
                })}
                subtitle={intl.formatMessage({
                    defaultMessage:
                        'Out-of-the-box features so that you focus only on adding enhancements.',
                    id: 'home.description.features'
                })}
            >
                <Container maxW={'6xl'} marginTop={10}>
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10}>
                        {features.map((feature, index) => {
                            const featureMessage = feature.message
                            return (
                                <HStack key={index} align={'top'}>
                                    <VStack align={'start'}>
                                        <Flex
                                            width={16}
                                            height={16}
                                            align={'center'}
                                            justify={'left'}
                                            color={'gray.900'}
                                            paddingX={2}
                                        >
                                            {feature.icon}
                                        </Flex>
                                        <Text color={'black'} fontWeight={700} fontSize={20}>
                                            {intl.formatMessage(featureMessage.title)}
                                        </Text>
                                        <Text color={'black'}>
                                            {intl.formatMessage(featureMessage.text)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            )
                        })}
                    </SimpleGrid>
                </Container>
            </Section>

            <Section
                padding={4}
                paddingTop={32}
                title={intl.formatMessage({
                    defaultMessage: "We're here to help",
                    id: 'home.heading.here_to_help'
                })}
                subtitle={
                    <>
                        <>
                            {intl.formatMessage({
                                defaultMessage: 'Contact our support staff.',
                                id: 'home.description.here_to_help'
                            })}
                        </>
                        <br />
                        <>
                            {intl.formatMessage({
                                defaultMessage: 'They will get you to the right place.',
                                id: 'home.description.here_to_help_line_2'
                            })}
                        </>
                    </>
                }
                actions={
                    <Button
                        as={Link}
                        href="https://help.salesforce.com/s/?language=en_US"
                        target="_blank"
                        width={'auto'}
                        paddingX={7}
                        _hover={{textDecoration: 'none'}}
                    >
                        <FormattedMessage defaultMessage="Contact Us" id="home.link.contact_us" />
                    </Button>
                }
                maxWidth={'xl'}
            />
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home
