import React from 'react'
import {AspectRatio, Container} from '@chakra-ui/react'

function Youtube() {
    return (
        <Container>
            <AspectRatio mt="10" maxW="980px" ratio={4 / 3}>
                <iframe
                    title="Youtube video"
                    src="https://www.youtube.com/embed/XpemhUgj_C8"
                    allowFullScreen
                />
            </AspectRatio>
        </Container>
    )
}

export default Youtube
