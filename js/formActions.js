document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('download-json').addEventListener('click', function() {
        if (!window.lastSubmission) {
            alert('Please submit the form first');
            return;
        }

        downloadFile(window.lastSubmission)
    });

    document.getElementById('copy-json').addEventListener('click', function() {
        if (!window.lastSubmission) {
            alert('Please submit the form first');
            return;
        } 
        const jsonString = JSON.stringify(window.lastSubmission, null, 2);
        copyToClipboard(jsonString)
    });
});

async function downloadFile(data) {
    try {
        const cleanData = {...data};
		delete cleanData.submit;

        const jsonData = await populateCodeJson(cleanData);

        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_');
        const filename = `user-feedback_${timestamp}.json`;

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
       
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        console.log('File downloaded successfully!')
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error generating download. Please try again.");
    }
}

function copyToClipboard() {
    try {
        const textarea = document.getElementById('json-result');
        textarea.select();
        document.execCommand('copy');

        alert('JSON copied to clipboard!');
    } catch (error) {
        console.error('Error copying to clipboard: ', error);
        alert('Error copying to clipboard. Please try again.');
    }
}