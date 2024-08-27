import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { loadOptions, resourceMapping } from './methods';

import { URL } from 'url';

export class PythonFunction implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Python Function',
		name: 'pythonFunction',
		icon: 'file:python.svg',
		group: ['output'],
		version: 1,
		description: 'Execute a python function',
		defaults: {
			name: 'Python Function',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'pythonMappingApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Function Name or ID',
				name: 'function',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getFunctions',
				},
				default: '',
				description:
					'Function to execute. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Arguments',
				name: 'arguments',
				type: 'resourceMapper',
				default: {
					mappingMode: 'defineBelow',
					value: null,
				},
				required: true,
				typeOptions: {
					resourceMapper: {
						resourceMapperMethod: 'getMappingArguments',
						mode: 'add',
						fieldWords: {
							singular: 'argument',
							plural: 'arguments',
						},
						addAllFields: true,
						supportAutoMap: true,
					},
				},
			},
		],
	};

	methods = {
		loadOptions,
		resourceMapping,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = [];
		const functionName = this.getNodeParameter('function', 0) as string;

		for (let i = 0; i < items.length; i++) {
			const mappingServer = (await this.getCredentials('pythonMappingApi'))
				.mappingServer as unknown as string;

			const response = await this.helpers.httpRequest({
				url: new URL('execute?function=' + functionName, mappingServer)?.href ?? '',
				body: (this.getNodeParameter('arguments', 0) as unknown as any).value,
				method: 'POST',
			});

			returnData.push(response);
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
