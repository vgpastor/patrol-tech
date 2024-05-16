const reportContainer = document.getElementById('report-container');

function addScanToReport(scan) {
    const scanElement = document.createElement('div');
    scanElement.classList.add('scan');
    scanElement.innerHTML = `
        <p><strong>QR Code:</strong> ${scan.qrCode}</p>
        <p><strong>Location:</strong> ${scan.location.latitude}, ${scan.location.longitude}</p>
        <p><strong>Timestamp:</strong> ${new Date(scan.timestamp).toLocaleString()}</p>
    `;
    reportContainer.prepend(scanElement); // Add new scans to the top
}

fetch('http://localhost:3000/api/scans')
    .then(response => response.json())
    .then(data => {
        data.forEach(scan => addScanToReport(scan));
    })
    .catch(error => {
        console.error('Error fetching scan data:', error);
    });

// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', event => {
    const scan = JSON.parse(event.data);
    addScanToReport(scan);
});
