const aws = require('aws-sdk');

async function resolve(action, parameters, resourceName, resource, getCFResources, serverless, serviceConfig) {
    const DBInstanceIdentifier = resource.Properties.DBInstanceIdentifier;

    switch(action) {
        case 'Ref':
            return DBInstanceIdentifier;
        case 'Fn::GetAtt':
            const rds = new aws.RDS(serviceConfig);
            const instancesResult = await rds.describeDBInstances({
              DBInstanceIdentifier
            }).promise();

            if (!instancesResult) {
              return action;
            }

            switch(parameters[1]) {
                case 'Endpoint.Address':
                    return instancesResult.DBInstances[0].Endpoint.Address;
                case 'Endpoint.Port':
                    return instancesResult.DBInstances[0].Endpoint.Port;
            }
            break;
    }
    return action;
}

module.exports = resolve;
