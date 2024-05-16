let html5QrCode;
let torchEnabled = false;

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

function startQrCodeScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,    // Optional, frame per seconds for qr code scanning
            qrbox: 250,  // Optional, if you want bounded box UI
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true,
                useTorch: true // Enable torch support
            }
        },
        qrCodeMessage => {
            const truncatedMessage = truncateText(qrCodeMessage, 30); // Truncate the QR code message to 30 characters
            document.querySelector("#qr-reader-result").textContent = truncatedMessage; // Display truncated QR code
        },
        errorMessage => {
            // Handle errors
            console.error(errorMessage);
        })
        .catch(err => {
            // Start failed, handle it
            console.error("QR Code Scanner initialization failed: ", err);
        });
}

function toggleTorch() {
    if (html5QrCode) {
        html5QrCode.setTorch(!torchEnabled)
            .then(() => {
                torchEnabled = !torchEnabled;
                console.log("Torch toggled");
            })
            .catch(err => {
                console.error("Torch toggle failed: ", err);
            });
    } else {
        console.error("QR Code Scanner is not initialized");
    }
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}

// Start the QR code scanner on page load
document.addEventListener("DOMContentLoaded", startQrCodeScanner);
