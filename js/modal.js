function showNotificationModal(message, type = 'info') {
    const modalHeader = document.querySelector('#notificationModal .modal-header');
    const modalTitle = document.querySelector('#notificationModalLabel');

    modalHeader.className = 'modal-header';

    switch (type) {
		case "success":
			modalHeader.style.backgroundColor = '#dff0d8';
            modalHeader.style.color = '#3c763d';
            modalHeader.textContent = 'Success';
            break;
		case "error":
			modalHeader.style.backgroundColor = '#dff0d8';
            modalHeader.style.color = '#3c763d';
            modalHeader.textContent = 'Error';
            break;
		case "warning":
			modalHeader.style.backgroundColor = '##fd3d47';
            modalHeader.style.color = '#680106';
            modalHeader.textContent = 'Warning';
            break;
		default:
			modalHeader.style.backgroundColor = '#dff0d8';
            modalHeader.style.color = '#3c763d';
            modalHeader.textContent = 'Information';
	}

    document.getElementById('notificationModalBody').textContent = message;

    $('#notificationModal').modal('show'); 
}

function showConfirmModal(message, onConfirm, onCancel = null) {
    document.getElementById('confirmModalBody').textContent = message;

    const confirmModal = $('#confirmModal');

    const okBtn = document.getElementById('confirmOKBtn');

    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    newOkBtn.addEventListener('click', function() {
        confirmModal.modal('hide');

        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        if (typeof onConfirm === 'function') {
            setTimeout(() => {
                onConfirm();
            }, 100);
        }
    });

    const cancelBtn = document.getElementById('confirmCancelBtn');

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newCancelBtn.addEventListener('click', function() {
        confirmModal.modal('hide');

        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        if (typeof onCancel === 'function') {
            setTimeout(() => {
                onCancel();
            }, 100);
        }
    });

    confirmModal.on('hidden.bs.modal', function() {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    })

    $('#confirmModal').modal('show'); 
}
