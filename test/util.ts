import { IIoHost, IoMessage, IoRequest } from '@aws-cdk/toolkit-lib';

export class FakeIoHost implements IIoHost {
  notify(_msg: IoMessage<unknown>): Promise<void> {
    return Promise.resolve();
  }
  requestResponse<T, U>(_msg: IoRequest<T, U>): Promise<U> {
    return Promise.resolve({} as U);
  }
}

export function buildCdkOut(
  stage: string,
  stackName: string,
): Record<string, any> {
  return {
    'manifest.json': JSON.stringify({
      version: '36.0.0',
      artifacts: {
        [`assembly-${stage}`]: {
          type: 'cdk:cloud-assembly',
          properties: {
            directoryName: `assembly-${stage}`,
            displayName: stage,
          },
        },
      },
    }),
    [`assembly-${stage}`]: {
      ['manifest.json']: JSON.stringify({
        version: '36.0.0',
        artifacts: {
          [`${stage}-${stackName}`]: {
            type: 'aws:cloudformation:stack',
            environment: 'aws://unknown-account/unknown-region',
            properties: {
              templateFile: `${stage}-${stackName}.template.json`,
              validateOnSynth: false,
              stackName: `${stage}-${stackName}`,
            },
            displayName: `${stage}/${stackName}`,
          },
        },
      }),
      [`${stage}-${stackName}.template.json`]: JSON.stringify({
        Resources: {
          MyRole: {
            Type: 'AWS::IAM::Role',
            Properties: {
              RoleName: 'MyCustomName',
            },
          },
        },
      }),
    },
  };
}
