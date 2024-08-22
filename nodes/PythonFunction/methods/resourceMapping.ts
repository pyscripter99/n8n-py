import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	ResourceMapperField,
	ResourceMapperFields,
} from 'n8n-workflow';

type Field = {
	name: string;
	friendly_name: string;
	description: string;
	type: string;
	required: boolean;
};

type NumberField = {
	name: string;
	friendly_name: string;
	description: string;
	default: number;
	required: boolean;
};

type StringField = {
	name: string;
	friendly_name: string;
	description: string;
	default: string;
	required: boolean;
};

type BooleanField = {
	name: string;
	friendly_name: string;
	description: string;
	default: boolean;
	required: boolean;
};

type OptionsField = {
	name: string;
	friendly_name: string;
	description: string;
	enum: string[];
	default: string;
	required: boolean;
};

function handleNumber(data: NumberField): ResourceMapperField {
	return {
		displayName: data.friendly_name,
		id: data.name,
		required: data.required,
		display: true,
		type: 'number',
		defaultMatch: true,
	};
}

function handleString(data: StringField): ResourceMapperField {
	return {
		displayName: data.friendly_name,
		id: data.name,
		required: data.required,
		display: true,
		type: 'string',
		defaultMatch: true,
	};
}

function handleBoolean(data: BooleanField): ResourceMapperField {
	return {
		displayName: data.friendly_name,
		id: data.name,
		required: data.required,
		display: true,
		type: 'boolean',
		defaultMatch: true,
	};
}

function handleEnum(data: OptionsField): ResourceMapperField {
	let opts: INodePropertyOptions[] = [];

	data.enum.forEach((e) => {
		opts.push({
			name: e.toLowerCase(),
			value: e,
		});
	});

	return {
		displayName: data.friendly_name,
		id: data.name,
		required: data.required,
		display: true,
		type: 'options',
		defaultMatch: true,
		options: opts,
	};
}

export async function getMappingArguments(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const mappingServer = (await this.getCredentials('pythonMappingApi'))
		.mappingServer as unknown as string;

	const response = await this.helpers.httpRequest({
		url:
			URL.parse('get_arguments?function=' + this.getNodeParameter('function', ''), mappingServer)
				?.href ?? '',
	});

	const data: Field[] = response;

	let fields: ResourceMapperField[] = [];

	data.forEach((arg) => {
		switch (arg.type) {
			case 'number':
				fields.push(handleNumber(arg as unknown as NumberField));
				break;
			case 'string':
				fields.push(handleString(arg as unknown as StringField));
				break;
			case 'boolean':
				fields.push(handleBoolean(arg as unknown as BooleanField));
				break;
			case 'options':
				fields.push(handleEnum(arg as unknown as OptionsField));
				break;
		}
	});

	const filteredFields = [...new Map(fields.map((item) => [item.id, item])).values()];

	return { fields: filteredFields };
}
