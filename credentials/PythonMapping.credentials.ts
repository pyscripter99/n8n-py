import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PythonMapping implements ICredentialType {
	name = 'pythonMapping';
	displayName = 'Python Mapping';
	properties: INodeProperties[] = [
		{
			displayName: 'Configuration Path',
			name: 'configPath',
			type: 'string',
			default: '',
		},
	];
}
