import {getAppOrigin} from 'pwa-kit-react-sdk/utils/url'

import configData from '../../config/default'

class SFCCEndpoint {
    constructor(commerceAPI) {
        this.commerceAPI = commerceAPI

        this.config = commerceAPI?._config?.sfccConfig

        const {proxyPath} = this.config

        this.host = `${getAppOrigin()}${proxyPath}`

        this.locale = commerceAPI.getConfig().locale.replace('-', '_') || 'default'

        this.url = `${this.host}/on/demandware.store/Sites-${configData.app.defaultSite}-Site/${this.locale}/`
    }
}

export default SFCCEndpoint
