import {
	IDataObject,
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { loadOptions } from './methods';

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
				type: 'json',
				required: true,
				default: '',
				description: 'Arguments for the function',
			},
		],
	};

	methods = {
		loadOptions,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = [];
		const functionName = this.getNodeParameter('function', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (functionName === 'parseEmail') {
				const data: IDataObject = {
					functionName,
					body: this.getNodeParameter('html', i),
				};
				returnData.push(data);
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
