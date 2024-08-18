import { execSync } from 'child_process';
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
	minimum: number | null;
	maximum: number | null;
	precision: number;
	default: number;
	required: boolean;
};

type StringField = {
	name: string;
	friendly_name: string;
	description: string;
	default: string;
	placeholder: string;
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
	const mappingPath = (await this.getCredentials('pythonMappingApi')).configPath;

	const retStdout = execSync(
		'python3 ' +
			mappingPath +
			' ' +
			Buffer.from(
				JSON.stringify({
					command: 'GET_ARGUMENTS',
					data: {
						function_name: this.getNodeParameter('function'),
					},
				}),
			).toString('base64'),
	).toString('utf-8');

	const data: Field[] = JSON.parse(retStdout);

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
