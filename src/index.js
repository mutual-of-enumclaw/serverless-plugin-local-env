'use strict';

const resolveResource = require('./resolvers');

class ServerlessPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = this.serverless.getProvider('aws');

        this.hooks = {
            'before:invoke:local:loadEnvVars': this.loadEnvironment.bind(this),
        };
    }

    getConfiguredEnvVars() {
        const providerEnvVars = this.serverless.service.provider.environment || {};
        const functionEnvVars = this.options.functionObj.environment || {};
        mergeEnv(functionEnvVars, providerEnvVars);
        return providerEnvVars;
    }

    async loadEnvironment() {
        const lambdaName = this.options.functionObj.name;
        const memorySize =
            Number(this.options.functionObj.memorySize) ||
            Number(this.serverless.service.provider.memorySize) ||
            1024;
    
        const lambdaDefaultEnvVars = {
            LANG: 'en_US.UTF-8',
            LD_LIBRARY_PATH:
            '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib', // eslint-disable-line max-len
            LAMBDA_TASK_ROOT: '/var/task',
            LAMBDA_RUNTIME_DIR: '/var/runtime',
            AWS_REGION: this.provider.getRegion(),
            AWS_DEFAULT_REGION: this.provider.getRegion(),
            AWS_LAMBDA_LOG_GROUP_NAME: this.provider.naming.getLogGroupName(lambdaName),
            AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
            AWS_LAMBDA_FUNCTION_NAME: lambdaName,
            AWS_LAMBDA_FUNCTION_MEMORY_SIZE: memorySize,
            AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
            NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules',
        };
    
        const credentialEnvVars = {};
        const { cachedCredentials } = this.provider;
        if (cachedCredentials) {
            if (cachedCredentials.accessKeyId) {
            credentialEnvVars.AWS_ACCESS_KEY_ID = cachedCredentials.accessKeyId;
            }
            if (cachedCredentials.secretAccessKey) {
            credentialEnvVars.AWS_SECRET_ACCESS_KEY = cachedCredentials.secretAccessKey;
            }
            if (cachedCredentials.sessionToken) {
            credentialEnvVars.AWS_SESSION_TOKEN = cachedCredentials.sessionToken;
            }
        }
    
        // profile override from config
        const profileOverride = this.provider.getProfile();
        if (profileOverride) {
            lambdaDefaultEnvVars.AWS_PROFILE = profileOverride;
        }
    
        const configuredEnvVars = this.getConfiguredEnvVars();
    
        for(let i in configuredEnvVars) {
            await resolveResource(i, configuredEnvVars, this.serverless, credentialEnvVars);
        }

        mergeEnv(lambdaDefaultEnvVars, process.env);
        mergeEnv(credentialEnvVars, process.env);
        mergeEnv(configuredEnvVars, process.env);
    }
}

function mergeEnv(source, dest) {
    if(!source || !dest) {
        return;
    }
    Object.keys(source).forEach(key => {
        dest[key] = source[key];
    });
}

module.exports = ServerlessPlugin;
