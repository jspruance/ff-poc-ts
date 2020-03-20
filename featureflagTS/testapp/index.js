const ffmodule = require('wm-feature-flag-client')

const init = async () => {
  const userId = '123'
  const appId = 'app-a'

  // initiate feature flag client
  const client = new ffmodule.FeatureFlagClient(userId, appId)
  await client.init()

  // check user access to two features
  // const featureA = await client.queryFeatureFlag('feature-A')
  // const featureB = await client.queryFeatureFlag('feature-B')

  const featuresA = await client.queryAllFeatureFlags()
  
  // log results
  console.log('\nResults')
  // console.log(`Feature A is enabled: ${featureA.enabled}`)
  // console.log(`Feature B is enabled: ${featureB.enabled}`)
  console.log(featuresA)
}

init()

