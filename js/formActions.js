document.getElementById('download-json').addEventListener('click', () => {
    if (!window.lastSubmission) {
        alert('Please submit the form first');
        return;
    }

    downloadFile(window.lastSubmission)
});

document.getElementById('copy-json').addEventListener('click', async function() {
    if (!window.lastSubmission) {
        alert('Please submit the form first');
        return;
    } 
    
    const jsonString = JSON.stringify(window.lastSubmission, null, 2);
    await copyToClipboard(jsonString)
});

// async function copyToClipboard(event) {
//     event.preventDefault();
   
//     if (!window.lastSubmission) {
//         alert('Please submit the form first');
//         return;
//     }

//     // Create temporary textarea
//     const textarea = document.createElement('textarea');
//     textarea.value = JSON.stringify(window.lastSubmission, null, 2);
//     textarea.style.position = 'fixed';
//     textarea.style.opacity = 0;
//     document.body.appendChild(textarea);
   
//     // Select and copy
//     textarea.select();
   
//     try {
//         const successful = document.execCommand('copy');
//         if (successful) {
//             showCopyFeedback();
//         } else {
//             alert('Copy failed. Please manually copy the text.');
//         }
//     } catch (err) {
//         console.error('Copy failed:', err);
//         alert('Copy not supported. Please manually copy the text.');
//     } finally {
//         document.body.removeChild(textarea);
//     }
// }

// function showCopyFeedback() {
//     const feedback = document.createElement('div');
//     feedback.textContent = '✓ Copied!';
//     feedback.style.position = 'fixed';
//     feedback.style.bottom = '20px';
//     feedback.style.right = '20px';
//     feedback.style.padding = '10px';
//     feedback.style.backgroundColor = '#4CAF50';
//     feedback.style.color = 'white';
//     feedback.style.borderRadius = '4px';
//     feedback.style.zIndex = '1000';
   
//     document.body.appendChild(feedback);
//     setTimeout(() => feedback.remove(), 2000);
// }

// // Attach to your button
// document.getElementById('copy-json')?.addEventListener('click', copyToClipboard);
