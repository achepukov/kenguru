@echo off
if defined ProgramFiles(x86) (
    @echo 64-bit
    start nodejs/node-v6.11.0-x64.msi
) else (
    @echo 32-bit 
    start nodejs/node-v6.11.0-x86.msi
)
