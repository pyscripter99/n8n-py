import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { URL } from 'url';

export async function getFunctions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const retData: INodePropertyOptions[] = [];

	const mappingServer = (await this.getCredentials('pythonMappingApi'))
		.mappingServer as unknown as string;

	const response = await this.helpers.httpRequest({
		url: new URL('list', mappingServer)?.href ?? '',
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
