/**
 * @module wm-feature-flag-client
 */
/**
 * Copyright (c) Warner Media. All rights reserved.
 */

'use strict'
import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import * as winston from 'winston'

const logger = winston.createLogger({
  transports: [ new winston.transports.Console() ]
})

interface IQueryFeatureResult {
  featureName: string
  enabled: boolean
  userId: string
}

interface IFeatureFlagClient {
  appId: string
  config: any
  userId: string
  createHash(userId: string, salt: string): string;
  createUserId(): string;
  getUserFeatureIndex(hash: string): string
  init(): void
  loadConfig(): void
  queryFeatureFlag(featureName: string): any
  queryAllFeatureFlags(): any
}

export class FeatureFlagClient implements IFeatureFlagClient {
  appId: string
  config: any
  userId: string

  constructor(userId: string, appId: string, config: any) {
    this.appId = appId
    this.config = config
    this.userId = userId
  }

  createHash(userId: string, salt: string) {
    const hash = crypto.createHmac('sha256', salt)
    hash.update(userId)
    const hashValue = hash.digest('hex')
    return hashValue
  }

  createUserId() {
    const userId = uuidv4()
    return userId
  }

  getUserFeatureIndex(hash: string) {
    const hashSegment = parseInt(hash.slice(-2), 16)
    return hashSegment.toString().slice(-2)
  }

  async init() {
    this.config = this.config ? this.config : await this.loadConfig()
    this.userId = this.userId ? this.userId : this.createUserId()
  }

  async loadConfig() {
    // placeholder for fetching of the app's feature config file from AWS S3
    return new Promise((resolve, reject) => {
      const testConfig = require('../config/app-a.json')
      setTimeout(() => resolve(testConfig), 300)
    })
  }

  queryFeatureFlag(featureName: string): IQueryFeatureResult {
    const featureConfig = this.config.features.filter((feature: any) => feature.name === featureName)
    const saltKey = featureConfig[0].saltKey
    const hash = this.createHash(this.userId, saltKey)
    const userFeatureIndex = this.getUserFeatureIndex(hash)
    const enabled = (parseInt(userFeatureIndex, 10) < featureConfig[0].rolloutRate) ? true : false

    // logging for demo only
    console.log(`\n${featureConfig[0].name}`)
    console.log(`rollout rate: ${featureConfig[0].rolloutRate}`)
    console.log(`user feature index: ${userFeatureIndex}`)
    
    return {
      featureName: featureConfig[0].name,
      enabled: enabled,
      userId: this.userId
    }
  }

  queryAllFeatureFlags() {
    const featureFlagResultsMap: any = []
    this.config.features.map((feature: any) => {
      const featureFlagData = this.queryFeatureFlag(feature.name)
      featureFlagResultsMap.push(featureFlagData)
    })
    return featureFlagResultsMap
  }

}
