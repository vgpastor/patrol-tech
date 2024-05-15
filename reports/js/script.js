fetch('http://localhost:3000/api/scans')
    .then(response => response.json())
    .then(data => {
        const reportContainer = document.getElementById('report-container');
        data.forEach(scan => {
            const scanElement = document.createElement('div');
            scanElement.classList.add('scan');
            scanElement.innerHTML = `
                <p>QR Code: ${scan.qrCode}</p>
                <p>Location: ${scan.location.latitude}, ${scan.location.longitude}</p>
                <p>Timestamp: ${new Date(scan.timestamp).toLocaleString()}</p>
            `;
            reportContainer.appendChild(scanElement);
        });
    });
