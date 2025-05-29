// Retrieves file and returns as json object
async function retrieveFile(filePath) {
	try {
		const response = await fetch(filePath);

		// Check if the response is OK (status code 200)
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		// Return the parsed JSON content
		return await response.json();
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
		return null;
	}
}

function transformArrayToOptions(arr) {
	return arr.map((item) => ({
		label: item.toString(),
		value: item.toString(),
	}));
}

function getRatingLabel(value) {
	const labels = {
		1: "Not clear at all",
		2: "Slightly clear",
		3: "Moderately clear",
		4: "Very clear",
		5: "Extremely clear"
	};
	return labels[value] || value;
}

// Function that handles validation object needed for each form component
function determineValidation(fieldName, fieldObject, requiredArray){
	return {
		"required": requiredArray.includes(fieldName)
	}
}

// Function that determines type of form component based on field
function determineType(field) {
	if (field.type === "object") {
		return "container";
	} else if (field.type === "array") {
		// Array of objects
		if (field.items.type === "object") {
			return "datagrid"
		}
		// Multi-select
		if (field.items.hasOwnProperty("enum")) {
			return "selectboxes";
		}
		// Free response list
		return "tags";
	} else if (field.hasOwnProperty("enum")) {
		if (field.type === "integer" &&
			JSON.stringify(field.enum) === JSON.stringify([1,2,3,4,5])) {
				return "select-rating";
			}
		// Single select
		return "radio";
	} else if (field.type === "number") {
		return "number";
	}
	else if (field.type === "integer") {
		return "integer";
	} else if (field.type === "boolean") {
		return "select-boolean";
	} else if (field.type === "string" || field.type.includes("string")) {
		if (field.format == "date-time") {
			return "datetime";
		}
		return "textfield";
	}
}

// Creates Form.io component based on json field type
function createComponent(fieldName, fieldObject, requiredArray) {
	const componentType = determineType(fieldObject);
	const validate = determineValidation(fieldName, fieldObject, requiredArray);

	const textFields = [
        "timeToComplete",
        "slowdownFactors",
        "repetitiveSections",
        "unnecessarySections",
        "commentsClarity",
        "confusingTerms",
        "riskAcceptanceUnderstanding",
		"timeConsumingSections",
		"challengingSections",
        "unclearSteps",
        "improvementSuggestions",
        "informationClarity"
    ]

	const useTextarea = textFields.includes(fieldName)

	const baseComponent = {
		hideLabel: false,
		label: fieldObject.description || fieldName,
		key: fieldName,
		description: "",
		input: true,
		validate
	}

	switch (componentType) {
		case "textfield":
			if (useTextarea) {
				return {
					...baseComponent,
					type: "textarea",
					rows: 3,
					wysiwyg: false,
					tableView: true,
				};
			} else {
				return {
					...baseComponent,
					type: "textfield",
					input: true,
				};
			}
		case "tags":
			return {
				...baseComponent,
				tableView: false,
				storeas: "array",
				validateWhenHidden: false,
				type: "tags",
			};
		case "number":
			return {
				...baseComponent,
				applyMaskOn: "change",
				mask: false,
				tableView: false,
				delimiter: false,
				requireDecimal: false,
				inputFormat: "plain",
				truncateMultipleSpaces: false,
				validateWhenHidden: false,
				type: "number",
			};
		case "integer":
			return {
				...baseComponent,
				applyMaskOn: "change",
				mask: false,
				tableView: false,
				delimiter: false,
				requireDecimal: false,
				decimalLimit: 0,
				inputFormat: "plain",
				truncateMultipleSpaces: false,
				validateWhenHidden: false,
				type: "number",
			};
		case "select-rating":
			const ratingOptions = fieldObject.enum.map(value => ({
				label: `${value} - ${getRatingLabel(value)}`,
				value: value.toString()
			}));
			return {
				...baseComponent,
				widget: "choicejs",
				placeholder: "Select a rating...1 - 5",
				tableView: false,
				data: { values: ratingOptions },
				validateWhenHidden: false,
				type: "select",
			}
		case "radio":
			if (fieldObject.type === "integer" &&
				JSON.stringify(fieldObject.enum) === JSON.stringify([1,2,3,4,5])) {
					return null;
			}
			var options = transformArrayToOptions(fieldObject.enum);
			console.log("checking options here:", options);
			return {
				...baseComponent,
				label: fieldObject["description"] || fieldName,
				hideLabel: false,
				optionsLabelPosition: "right",
				inline: false,
				tableView: false,
				values: options,
				validateWhenHidden: false,
				type: "radio",
				input: true,
			};
		case "selectboxes":
			var options = transformArrayToOptions(fieldObject.items.enum);
			console.log("checking options here:", options);
			return {
				...baseComponent,
				optionsLabelPosition: "right",
				tableView: false,
				values: options,
				validateWhenHidden: false,
				type: "selectboxes",
				inputType: "checkbox",
			};
		case "datetime":
			return {
				...baseComponent,
				tableView: false,
				datePicker: {
					disableWeekends: false,
					disableWeekdays: false
				},
				enableTime: false,
				validateWhenHidden: false,
				key: fieldName,
				type: "datetime",
				widget: {
					type: "calendar",
					displayInTimezone: "viewer",
					locale: "en",
					useLocaleSettings: false,
					allowInput: true,
					mode: "single",
					noCalendar: false,
					format: "yyyy-MM-dd",
					disableWeekends: false,
					disableWeekdays: false,
				},
			};
		case "select-boolean":
			return {
				...baseComponent,
				label: fieldObject["description"] || fieldName,
				hideLabel: false,
				widget: "html5",
				tableView: true,
				data: {
					values: [
						{
							label: "True",
							value: "true"
						},
						{
							label: "False",
							value: "false"
						}
					]
				},
				validateWhenHidden: false,
				type: "select",
				input: true,
			};
		case "container": 
			return {
				...baseComponent,
				label: fieldObject["description"] || fieldName,
				hideLabel: false,
				tableView: false,
				validateWhenHidden: false,
				type: "container",
				components: [],
			};
		case "datagrid":
			return {
				...baseComponent,
				reorder: false,
				layoutFixed: false,
				enableRowGroups: false,
				initEmpty: false,
				tableView: false,
				defaultValue: [
					{}
				],
				validateWhenHidden: false,
				type: "datagrid",
				components: [],
			}; 
		default:
			break;
	}
}

// Adds heading containing schema information
function createFormHeading(title, description) {
	const container = document.getElementById('form-header');
	container.innerHTML = `<h1>${title}</h1>\n<h2>${description}</h2>`;
}

// Iterates through each json field and creates component array for Form.io
function createAllComponents(schema, prefix = ""){
	let components = [];

	if (schema.type === "object" && schema.properties) {

		const items = schema.properties.hasOwnProperty("items") ? schema.properties.items : schema.properties;
		
		let requiredArray = [];
		if (schema.hasOwnProperty("required")) {
			requiredArray = schema.required;
		}

        for (const [key, value] of Object.entries(items)) {
            
			console.log("key at play:", key);
			const fullKey = prefix ? `${prefix}.${key}` : key;

			let fieldComponent = createComponent(key, value, requiredArray);

			if (fieldComponent.type === "container") {
				fieldComponent.components = createAllComponents(value, fullKey);
			} 
			else if (fieldComponent.type === "datagrid") {
				fieldComponent.components = createAllComponents(value.items, fullKey);
			}

			components.push(fieldComponent);
        }
    }

    return components;
}

// Creates complete form based on input json schema
async function createFormComponents() {
	let components = [];

	const filePath = "schemas/user-feedback-part-2.json";
	const jsonData = await retrieveFile(filePath);
	console.log("JSON Data:", jsonData);

	createFormHeading(jsonData["title"], jsonData["description"]);

	components = createAllComponents(jsonData);

	// Add submit button to form
	components.push({
		type: "button",
		label: "Submit",
		key: "submit",
		disableOnInvalid: false,
		input: true,
		tableView: false,
	});

	return components;
}

window.createFormComponents = createFormComponents;
