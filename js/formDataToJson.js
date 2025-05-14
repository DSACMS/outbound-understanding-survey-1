function isMultiSelect(obj) {
	for (const key in obj) {
	  if (typeof obj[key] !== 'boolean') {
		return false;
	  }
	}
	return Object.keys(obj).length > 0;
}

function getSelectedOptions(options) {
  let selectedOptions = [];

  for (let key in options) {
	  if(options[key]) {
		  selectedOptions.push(key);
	  }
  }
  return selectedOptions;
}

async function populateCodeJson(data) {
    try {
        const filePath = "schemas/user-feedback-part-2.json";
        const schema = await retrieveFile(filePath);
       
        if (!schema || !schema.properties) {
            console.error("Invalid schema structure");
            return data;
        }

        const sourceProperties = schema.properties;
        if (!sourceProperties) {
            console.error("No properties found in schema");
            return data;
        }

        const result = {};

        for (const key of Object.keys(sourceProperties)) {
            if (data.hasOwnProperty(key)) {
				let value = data[key];
                
				if (typeof value === "object" && value !== null && isMultiSelect(value)) {
					value = getSelectedOptions(value);
				}

				result[key] = value;
            }
        }

        return result;
    } catch (error) {
        console.error("Error in populateCodeJson:", error);
        return data;
    }
}
