const FORM_DATA_KEY = 'userFormProgress';
const FORM_TIMESTAMP_KEY = 'userFormTimestamp';

document.addEventListener('DOMContentLoaded', function() {
    addSaveButton();
    checkForSavedData();
})

function addSaveButton() {
    const formioContainer = document.getElementById('formio');

    let actionContainer = document.getElementById('form-save-actions');

    if (!actionContainer) {
        actionContainer = document.createElement('div');
        actionContainer.id = 'form-save-actions';
        actionContainer.className = 'form-save-actions';
        actionContainer.style.marginTop = '20px';
        actionContainer.style.marginBottom = '20px';

        formioContainer.parentNode.insertBefore(actionContainer, formioContainer.nextSibling);
    }

    actionContainer.innerHTML = `
        <div class="btn-group">
			<button id="save-progress" class="btn btn-info">Save Progress</button>
			<button id="load-progress" class="btn btn-warning" style="margin-left: 10px;">Load Saved Progress</button>
			<button id="delete-progress" class="btn btn-danger" style="margin-left: 10px;">Delete Saved Progress</button>
		</div>
    `;

    document.getElementById('save-progress').addEventListener('click', saveFormProgress);
    document.getElementById('load-progress').addEventListener('click', loadFormProgress);
    document.getElementById('delete-progress').addEventListener('click', deleteFormProgress);
}

function saveFormProgress() {
    try {
        const formElement = document.querySelector('.formio-component');
        if (!formElement || !window.formInstance) {
            showNotificationModal('Could not find instance. Please try again.', 'error');
            return;
        } 

        const currentData = window.formInstance.submission.data;

        localStorage.setItem(FORM_DATA_KEY, JSON.stringify(currentData));

        const now = new Date();
        localStorage.setItem(FORM_TIMESTAMP_KEY, now.toString());

        showNotificationModal(`Progress saved successfully (${now.toLocaleString()})`, 'success')
    } catch (error) {
        console.error("Error Saving Progress:", error);
        showNotificationModal('Error saving progress. Please try again.', 'error');
    }
}

function loadFormProgress() {
    try {
        const savedData = localStorage.getItem(FORM_DATA_KEY);
        const timestamp = localStorage.getItem(FORM_TIMESTAMP_KEY);

        if(!savedData) {
            showNotificationModal('No saved progress found.', 'warning');
        }

        const confirmMessage = timestamp ? `Load saved progress from ${new Date(timestamp).toLocaleString()}?` : 'Do you want to load saved pprogres? This will replace your current answers.';

        showConfirmModal(confirmMessage, function() {
            if (!window.formInstance) {
                showNotificationModal('Could not find instance. Please refresh the page.', 'error');
                return;
            }

            const formData = JSON.parse(savedData);

            window.formInstance.submission = {
                data: formData
            };

            showNotificationModal('Saved progress loaded!', 'success');
        })
    } catch (error) {
        console.error("Error loading saved progress:", error);
        showNotificationModal('Error loading saved progress. Please try again.', 'error');
    }
}

function deleteFormProgress() {
    const savedData = localStorage.getItem(FORM_DATA_KEY);

    if (!savedData) {
        showNotificationModal('No saved data to delete.', 'warning');
        return;
    }

    showConfirmModal('Are you sure you want to delete your work? This can\'t be undone.', function() {
        localStorage.removeItem(FORM_DATA_KEY);
        localStorage.removeItem(FORM_TIMESTAMP_KEY);

        showNotificationModal('Saved data deleted successfully.', 'success');
    });
}

function checkForSavedData() {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    const timestamp = localStorage.getItem(FORM_TIMESTAMP_KEY);

    if (savedData && timestamp) {
        const saveDate = new Date(timestamp);
        const now = new Date();

        const hoursDiff = Math.abs(now - saveDate) / 36e5;

        if (hoursDiff < 168) {
            setTimeout(() => {
                showConfirmModal(
                    `You have saved data from ${saveDate.toLocaleString()}. Would you like to load it and continue?`,
                    function() {
                        loadFormProgress();
                    }
                );
            }, 1000);
        }
    }
}