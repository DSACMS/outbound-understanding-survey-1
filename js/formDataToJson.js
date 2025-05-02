// Retrieves file and returns as json object
async function retrieveFile(filePath) {
	try {
		const cacheBuster = `?t=${Date.now()}`;
		const response = await fetch(filePath + cacheBuster);

		if (!response.ok) {
			throw new Error(`Network response was not ok ${response.status}`);
		}
		// Returns file contents in a json format
		return await response.json();
	} catch (error) {
		console.error("There was a problem with the fetch operation:", {
			filePath: filePath,
			error: error.message
		});

		try {
			const absolutePath = new URL(filePath, window.location.href).href;
			const fallbackResponse = await fetch(absolutePath + cacheBuster);

			if (!fallbackResponse.ok) throw new Error(`Fallback failed`);

			return await fallbackResponse.json();
		} catch (fallbackError) {
			console.error("Fallback loading failed: ", fallbackError);
			throw new Error(`Cannot load file at ${filePath}`);
		}
	}
}

function isMultiSelect(obj) {
	for (const key in obj) {
	  if (typeof obj[key] !== 'boolean') {
		return false;
	  }
	}
	return true; // Returns true if all values are booleans
}

// Convert from dictionary to array
function getSelectedOptions(options) {
  let selectedOptions = [];

  for (let key in options) {
	  if(options[key]) {
		  selectedOptions.push(key);
	  }
  }
  return selectedOptions;
}

// Populates fields with form data
function populateObject(data, schema) {
	let reorderedObject = {}

	// Array of fields following proper order of fields in schema
	const fields = Object.keys(schema.properties.items);

	for (const key of fields) {
		let value = data[key];

		// Adjusts value accordingly if multi-select field
		if((typeof value === "object" && isMultiSelect(value))) {
			value = getSelectedOptions(value);
		}

		reorderedObject[key] = value;
	}

	return reorderedObject;
}

async function populateCodeJson(data) {
    try {
        const filePath = "schemas/user-feedback-part-2.json";
        const schema = await retrieveFile(filePath);
       
        if (!schema || !schema.properties) {
            console.error("Invalid schema structure");
            return data; // Return the original data if schema is invalid
        }

        // Handle both direct properties and items container
        const sourceProperties = schema.properties.items
            ? schema.properties.items.properties
            : schema.properties;

        if (!sourceProperties) {
            console.error("No properties found in schema");
            return data;
        }

        const fields = Object.keys(sourceProperties);
        const result = {};

        // Populate fields while preserving schema order
        for (const key of fields) {
            if (data.hasOwnProperty(key)) {
                result[key] = data[key];
            }
        }

        return result;
    } catch (error) {
        console.error("Error in populateCodeJson:", error);
        return data; // Fallback to original data on error
    }
}

async function downloadFile(data) {
    try {
        // Clean the data first
        const cleanData = {...data};
        delete cleanData.submit;

        // Generate the structured JSON
        const jsonData = await populateCodeJson(cleanData);
       
        // Create filename with timestamp
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_');
        const filename = `user-feedback_${timestamp}.json`;
       
        // Create and trigger download
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
       
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
       
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error generating download. Please try again.");
    }
}

// Copies code.json to clipboard
async function copyToClipboard(event){
	event.preventDefault();

	var textArea = document.getElementById("json-result");
    textArea.select();
	document.execCommand("copy")
	alert('Copied!');
}

window.createCodeJson = createCodeJson;
window.copyToClipboard = copyToClipboard;
window.downloadFile = downloadFile;
