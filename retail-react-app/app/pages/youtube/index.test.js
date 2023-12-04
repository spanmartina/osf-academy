import React from 'react'
import {renderWithProviders} from '../../utils/test-utils'
import Youtube from './index'

test('Youtube component renders with the correct video URL', () => {
    const {getByTitle} = renderWithProviders(<Youtube />)
    const videoPlayer = getByTitle('Youtube video')

    expect(videoPlayer).toBeInTheDocument()
    expect(videoPlayer).toHaveAttribute('src', 'https://www.youtube.com/embed/XpemhUgj_C8')
})

test('Youtube component renders an iframe element', () => {
    const {container} = renderWithProviders(<Youtube />)
    const iframeElement = container.querySelector('iframe')

    expect(iframeElement).toBeInTheDocument()
})
