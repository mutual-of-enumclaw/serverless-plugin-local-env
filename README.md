# serverless-plugin-local-env
This plugin is used to resolve AWS resources in the debugger environment variables when using the serverless framework.

## Use case
When debugging with serverless framework, resources created and referenced as part of the framework will often resolve to
"[object object]".  This makes debugging with serverless framework very difficult as reproducing the lambda environment
must then be done with command line attributes.

This plugin will connect with your AWS Stack and its resources in order to resolve "Ref", "Fn::GetAtt" and "Fn::ImportValue"
statements when setting up your environment variables for local debugging.

# Implementing

Install the plugin into the directory your serverless.yml is located
``` bash
npm install @moe-tech/serverless-plugin-local-env
```

Add the plugin to your serverless yaml plugins
```yaml
plugins:
    - "@moe-tech/serverless-plugin-local-env"
```

Invoke your function
``` bash
serverless invoke local --function {Function Name}
```

## Cache
In order to improve performance this plugin creates a cache of resources references.  This cache is automatically cleared out
when a new deployment occurs, but can also be manually cleared by deleting the ".serverless/invoke.cache.json" file.

# Example
The example provided is a serverless project which contains a DynamoDB Table, an SNS Topic, an SQS Queue, a Lambda Function and it exports a value.

## Steps:
1. navigate to the example directory in the console "./example"
2. install dependencies
    ``` bash
    npm ci
    ```
3. deploy the serverless project
    ``` bash
    serverless deploy
    ```
4. Un-comment lines #34 & #35 in the serverless.yml file
5. Invoke the function to run locally
    ``` bash
    serverless invoke local --function hello
    ```
    or
    ``` bash
    npm start
    ```
6. View the console logs which are printed
