/**
 * @module wm-feature-flag-client
 */
/**
 * Copyright (c) Warner Media. All rights reserved.
 */
interface IQueryFeatureResult {
    featureName: string;
    enabled: boolean;
    userId: string;
}
interface IFeatureFlagClient {
    appId: string;
    config: any;
    userId: string;
    createHash(userId: string, salt: string): string;
    createUserId(): string;
    getUserFeatureIndex(hash: string): string;
    init(): void;
    loadConfig(): void;
    queryFeature(featureName: string): any;
    queryAllFeatures(): any;
}
export declare class FeatureFlagClient implements IFeatureFlagClient {
    appId: string;
    config: any;
    userId: string;
    constructor(userId: string, appId: string, config: any);
    createHash(userId: string, salt: string): string;
    createUserId(): string;
    getUserFeatureIndex(hash: string): string;
    init(): Promise<void>;
    loadConfig(): Promise<unknown>;
    queryFeature(featureName: string): IQueryFeatureResult;
    queryAllFeatures(): any;
}
export {};
