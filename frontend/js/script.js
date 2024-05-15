function submitScan() {
    navigator.geolocation.getCurrentPosition(position => {
        const qrResult = document.querySelector("#qr-reader-result").textContent; // This should be replaced with actual QR code data
        const data = {
            qrCode: qrResult,
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        };

        fetch('http://localhost:3000/api/scans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Scan data submitted successfully');
            } else {
                alert('Failed to submit scan data');
            }
        });
    });
}

const html5QrCode = new Html5Qrcode("qr-reader");
html5QrCode.start(
    { facingMode: "environment" },
    {
        fps: 10,    // Optional, frame per seconds for qr code scanning
        qrbox: 250  // Optional, if you want bounded box UI
    },
    qrCodeMessage => {
        document.querySelector("#qr-reader-result").textContent = qrCodeMessage; // Display scanned QR code
    },
    errorMessage => {
        // Handle errors
        console.error(errorMessage);
    })
    .catch(err => {
        // Start failed, handle it
        console.error("QR Code Scanner initialization failed: ", err);
    });

function toggleTorch() {
    // Placeholder function to toggle the torch on/off if supported by the library
    console.log("Torch toggled");
}
