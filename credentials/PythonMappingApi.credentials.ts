import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PythonMappingApi implements ICredentialType {
	name = 'pythonMappingApi';
	displayName = 'Python Mapping API';
	properties: INodeProperties[] = [
		{
			displayName: 'Configuration Path',
			name: 'configPath',
			type: 'string',
			default: '',
		},
	];
}
