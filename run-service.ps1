# Helper para lanzar un microservicio en ventana separada.
# Uso: .\run-service.ps1 -ServicePath "ruta\al\servicio"
param(
    [Parameter(Mandatory=$true)]
    [string]$ServicePath
)

$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
$env:PATH     = "$env:JAVA_HOME\bin;" + $env:PATH

$mvn = "C:\Users\paul\.m2\wrapper\dists\apache-maven-3.9.11-bin\6mqf5t809d9geo83kj4ttckcbc\apache-maven-3.9.11\bin\mvn.cmd"

Set-Location $ServicePath
Write-Host "`n=== Iniciando: $ServicePath ===" -ForegroundColor Cyan
& $mvn spring-boot:run
