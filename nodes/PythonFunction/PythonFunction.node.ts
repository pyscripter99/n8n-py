import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { loadOptions, resourceMapping } from './methods';
import { execSync } from 'child_process';

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
				name: 'pythonMapping',
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
			const mappingPath = (await this.getCredentials('pythonMapping')).configPath;

			const retStdout = execSync(
				'python3 ' +
					mappingPath +
					' ' +
					Buffer.from(
						JSON.stringify({
							command: 'EXECUTE',
							data: {
								function_name: functionName,
								data: JSON.parse(JSON.stringify(this.getNodeParameter('arguments', i)))['value'],
							},
						}),
					).toString('base64'),
			).toString('utf-8');

			const data = JSON.parse(retStdout);

			returnData.push(data);
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
