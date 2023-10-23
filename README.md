    <zxing-scanner
    [enable]="scannerEnabled" 
    [(device)]="desiredDevice"
    [torch]="torch"
    (torchCompatible)="onTorchCompatible($event)"
    (camerasFound)="camerasFoundHandler($event)"
    (camerasNotFound)="camerasNotFoundHandler($event)"
    (scanSuccess)="scanSuccessHandler($event)"
    (scanError)="scanErrorHandler($event)"
    (scanFailure)="scanFailureHandler($event)"
    (scanComplete)="scanCompleteHandler($event)"
    ></zxing-scanner>


enable->Starts and Stops the scanning.

autofocusEnabledue->Not working at the moment, needs ImageCapture API implementation.

device->The video-device used for scanning (use one of the devices emitted by camerasFound), it can be set or emit some value.

torch->Can turn on/off the device flashlight.

torchCompatible->Tells if the device's torch is compatible w/ the scanner.

camerasFound->Emits an array of video-devices after view was initialized.
camerasNotFound->Emits a void event when cameras aren't found.
scanSuccess->Emits the result as string, after a valid QR code was scanned.

scanError->Emitted when some error occurs during the scan process.

scanFailure->Emitted when the scanner couldn't decode any result from the media stream.

scanComplete->Emitted after any scan attempt, no matter what.

        
git branch diseño refs/heads/develop --force
