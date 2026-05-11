$port = 8080
$root = "C:\Users\user\.gemini\antigravity\scratch\uzum-market-clone"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Listening on http://localhost:$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    $path = $context.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    
    $file = Join-Path $root $path.Replace('/', '\')
    
    if (Test-Path $file) {
        $buffer = [System.IO.File]::ReadAllBytes($file)
        $response.ContentLength64 = $buffer.Length
        
        # Set content type
        if ($file.EndsWith(".css")) {
            $response.ContentType = "text/css"
        } elseif ($file.EndsWith(".js")) {
            $response.ContentType = "application/javascript"
        } elseif ($file.EndsWith(".html")) {
            $response.ContentType = "text/html"
        }
        
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
