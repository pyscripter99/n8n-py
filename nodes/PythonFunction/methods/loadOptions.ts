import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { execSync } from 'child_process';

export async function getFunctions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const retData: INodePropertyOptions[] = [];

	const mappingPath = (await this.getCredentials('pythonMappingApi')).configPath;

	const retStdout = execSync('python3 ' + mappingPath).toString('utf-8');

	const data: { friendly_name: string; name: string }[] = JSON.parse(retStdout);

	data.map((value) => {
		retData.push({
			name: value.friendly_name,
			value: value.name,
		});
	});

	return retData;
}
