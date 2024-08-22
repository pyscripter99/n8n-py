import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

export async function getFunctions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const retData: INodePropertyOptions[] = [];

	const mappingServer = (await this.getCredentials('pythonMappingApi'))
		.mappingServer as unknown as string;

	const response = await this.helpers.httpRequest({
		url: URL.parse('list', mappingServer)?.href ?? '',
	});

	const data: { friendly_name: string; name: string }[] = response;

	data.map((value) => {
		retData.push({
			name: value.friendly_name,
			value: value.name,
		});
	});

	return retData;
}
