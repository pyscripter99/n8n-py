import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PythonMappingApi implements ICredentialType {
	name = 'pythonMappingApi';
	displayName = 'Python Mapping API';
	properties: INodeProperties[] = [
		{
			displayName: 'Mapping Server',
			name: 'mappingServer',
			type: 'string',
			default: 'http://mapping:5566/',
		},
	];
}
