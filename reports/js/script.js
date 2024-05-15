fetch('http://localhost:3000/api/scans')
    .then(response => response.json())
    .then(data => {
        const reportContainer = document.getElementById('report-container');
        data.forEach(scan => {
            const scanElement = document.createElement('div');
            scanElement.classList.add('scan');
            scanElement.innerHTML = `
                <p><strong>QR Code:</strong> ${scan.qrCode}</p>
                <p><strong>Location:</strong> ${scan.location.latitude}, ${scan.location.longitude}</p>
                <p><strong>Timestamp:</strong> ${new Date(scan.timestamp).toLocaleString()}</p>
            `;
            reportContainer.appendChild(scanElement);
        });
    })
    .catch(error => {
        console.error('Error fetching scan data:', error);
    });
